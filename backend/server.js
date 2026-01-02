// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://fyp-project-backend.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected ✅."))
  .catch((err) => console.error("MongoDB connection error:", err));

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// University-specific system prompt
const UNIVERSITY_SYSTEM_PROMPT = `You are EduConnect Assistant, an AI assistant for Sindh Madarsatul Islam University (SMIU) in Karachi, located in Sadar in front of HBL Plaza.

Your role is to help students with:
1. University procedures and information
2. Enrollment guidance
3. Academic queries
4. University services
5. General student support

IMPORTANT INFORMATION:
- University Name: Sindh Madarsatul Islam University (SMIU)
- Location: Sadar, Karachi, in front of HBL Plaza
- CMS Portal: http://cms.smiu.edu.pk:9991/psp/ps/EMPLOYEE/HRMS/?cmd=logout
- SAMS Portal: http://sams.smiu.edu.pk/Student/StudentDashboard

SPECIFIC PROCEDURES:
1. ENROLLMENT: Go to CMS portal → Self Service → Enrollment → Enrollment: Add Classes
2. CHECK MARKS: CMS portal → Self Service → Enrollment → View My Assignments
3. CHECK CGPA/TRANSCRIPT: CMS portal → Self Service → Academic Records → View Unofficial Transcript
4. LOST ID CARD: File an FIR at police station → Apply for new card at SAMS portal

RESPONSE GUIDELINES:
- Be friendly, helpful, and professional
- Provide clear, step-by-step instructions when needed
- Use simple, easy-to-understand language
- If you don't know something, admit it politely
- Always refer students to official university portals for sensitive operations
- Never provide personal advice or make decisions for students
- Keep responses concise but informative

FORMATTING:
- Use plain text only (no markdown)
- Use bullet points only when listing steps
- Keep paragraphs short for readability
- Use appropriate emojis occasionally for friendliness

Now respond to the student's question as EduConnect Assistant.`;

// Chat endpoint with university context
app.post("/api/chat", protect, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required" });
    }

    // Format conversation history
    const conversation = messages
      .map(
        (msg) =>
          `${msg.role === "user" ? "Student" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const fullPrompt = `${UNIVERSITY_SYSTEM_PROMPT}\n\nConversation History:\n${conversation}\n\nAssistant:`;

    try {
      const geminiRes = await ai.models.generateContent({
        model: "gemini-2.5-flash", // You can use gemini-2.0-flash-exp if available
        contents: fullPrompt,
      });

      const aiText =
        geminiRes.text ||
        "I'm here to help! Could you please rephrase your question?";

      res.json({
        success: true,
        content: aiText,
        timestamp: new Date().toISOString(),
      });
    } catch (aiError) {
      console.error("Gemini API Error:", aiError);
      res.status(500).json({
        success: false,
        error: "AI service temporarily unavailable. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Chat endpoint error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process your request. Please try again.",
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

app.get("/", (req, res) => {
  res.send("EduConnect Server is running.");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "EduConnect API",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EduConnect Server running on port ${PORT}`);
});
