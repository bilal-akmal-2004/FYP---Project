// backend/routes/chatRoutes.js
import express from "express";
import Chat from "../models/Chat.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all chats for user
router.get("/", protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      userId: req.user._id,
      isActive: true,
    })
      .sort({ updatedAt: -1 })
      .select("title createdAt updatedAt")
      .limit(50); // Limit to prevent excessive data

    res.json({ success: true, chats });
  } catch (error) {
    console.error("Get chats error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch chats" });
  }
});

// Get specific chat
router.get("/:chatId", protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }

    res.json({ success: true, chat });
  } catch (error) {
    console.error("Get chat error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch chat" });
  }
});

// Save or update chat
router.post("/save", protect, async (req, res) => {
  try {
    const { chatId, messages, title } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res
        .status(400)
        .json({ success: false, error: "Messages are required" });
    }

    let chat;

    if (chatId) {
      // Update existing chat
      chat = await Chat.findOneAndUpdate(
        { _id: chatId, userId: req.user._id },
        {
          messages,
          title: title || "Updated Chat",
          updatedAt: Date.now(),
        },
        { new: true }
      );

      if (!chat) {
        return res
          .status(404)
          .json({ success: false, error: "Chat not found" });
      }
    } else {
      // Create new chat
      const chatTitle =
        title ||
        (messages[0]?.role === "user"
          ? messages[0].content.substring(0, 50) +
            (messages[0].content.length > 50 ? "..." : "")
          : "New Chat");

      chat = await Chat.create({
        userId: req.user._id,
        title: chatTitle,
        messages,
      });
    }

    res.json({ success: true, chat });
  } catch (error) {
    console.error("Save chat error:", error);
    res.status(500).json({ success: false, error: "Failed to save chat" });
  }
});

// Delete chat
router.delete("/:chatId", protect, async (req, res) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.chatId,
        userId: req.user._id,
      },
      { isActive: false },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }

    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Delete chat error:", error);
    res.status(500).json({ success: false, error: "Failed to delete chat" });
  }
});

// Clear all chats (soft delete)
router.delete("/", protect, async (req, res) => {
  try {
    await Chat.updateMany(
      { userId: req.user._id, isActive: true },
      { isActive: false }
    );

    res.json({ success: true, message: "All chats cleared" });
  } catch (error) {
    console.error("Clear chats error:", error);
    res.status(500).json({ success: false, error: "Failed to clear chats" });
  }
});

export default router;
