// src/components/home/ChatbotTab.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const ChatbotTab = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Helper function to extract first user message for title
  const extractChatTitle = (messagesArray) => {
    if (!messagesArray || messagesArray.length === 0) {
      return "University Chat";
    }

    // Find first user message
    const firstUserMessage = messagesArray.find((msg) => msg.role === "user");

    if (firstUserMessage && firstUserMessage.content) {
      const content = firstUserMessage.content.trim();

      // Truncate if too long
      if (content.length > 40) {
        return content.substring(0, 40) + "...";
      }

      // Capitalize first letter
      return content.charAt(0).toUpperCase() + content.slice(1);
    }

    // If no user message found, check if there's any message
    const firstMessage = messagesArray[0];
    if (firstMessage && firstMessage.content) {
      const content = firstMessage.content.trim();
      if (content.length > 40) {
        return content.substring(0, 40) + "...";
      }
      return content.charAt(0).toUpperCase() + content.slice(1);
    }

    return "University Chat";
  };

  // Function to parse text and convert URLs to clickable links
  const parseMessageContent = (content) => {
    if (!content) return content;

    // Regular expression to find URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split content by URLs and map to elements
    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        // Clean up URL if it ends with punctuation
        let cleanUrl = part;
        const punctuation = [".", ",", "!", "?", ":", ";", ")", "]", "}"];

        // Remove trailing punctuation from URL
        punctuation.forEach((punct) => {
          if (cleanUrl.endsWith(punct) && !cleanUrl.endsWith(`.${punct}`)) {
            cleanUrl = cleanUrl.slice(0, -1);
          }
        });

        // Extract domain for display
        let displayText = cleanUrl;
        try {
          const urlObj = new URL(cleanUrl);
          displayText = urlObj.hostname.replace("www.", "");
          // Add path if not too long
          if (urlObj.pathname !== "/" && urlObj.pathname.length < 30) {
            displayText += urlObj.pathname;
          }
        } catch (e) {
          // If URL parsing fails, use original text
          displayText =
            cleanUrl.length > 50 ? cleanUrl.substring(0, 50) + "..." : cleanUrl;
        }

        return (
          <a
            key={index}
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 hover:scale-[1.02] ${
              theme === "light"
                ? "text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200"
                : "text-blue-400 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-800"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toast.info(`Opening: ${displayText}`, {
                autoClose: 2000,
                hideProgressBar: true,
              });
            }}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span className="text-xs font-medium">{displayText}</span>
          </a>
        );
      }
      return part;
    });
  };

  // Function to check if text contains URLs
  const containsURLs = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(content);
  };

  // Initial greeting message
  useEffect(() => {
    const greetingMessage = {
      role: "assistant",
      content:
        "Hello! I'm EduConnect Assistant. How can I help you with Sindh Madarsatul Islam University today? You can ask me about enrollment, marks, university procedures, or any other academic queries! 🎓",
      timestamp: new Date().toISOString(),
    };
    setMessages([greetingMessage]);
    loadChatHistory();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/chats`,
        { withCredentials: true },
      );
      if (response.data.success) {
        setChatHistory(response.data.chats);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Send to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat`,
        { messages: updatedMessages },
        { withCredentials: true },
      );

      if (response.data.success) {
        const aiMessage = {
          role: "assistant",
          content: response.data.content,
          timestamp: response.data.timestamp || new Date().toISOString(),
        };

        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);

        // Save to database with dynamic title
        await saveChat(finalMessages);
      } else {
        throw new Error(response.data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        role: "assistant",
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment. If the problem persists, contact university IT support.",
        timestamp: new Date().toISOString(),
      };

      setMessages([...updatedMessages, errorMessage]);

      // Even on error, save the conversation with dynamic title
      await saveChat([...updatedMessages, errorMessage]);

      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const saveChat = async (messagesToSave) => {
    try {
      const chatTitle = extractChatTitle(messagesToSave);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chats/save`,
        {
          chatId,
          messages: messagesToSave,
          title: chatTitle,
        },
        { withCredentials: true },
      );

      if (response.data.success) {
        if (!chatId) {
          setChatId(response.data.chat._id);
        }
        loadChatHistory(); // Refresh history with new title
      }
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const loadChat = async (chat) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/chats/${chat._id}`,
        { withCredentials: true },
      );

      if (response.data.success) {
        setMessages(response.data.chat.messages);
        setChatId(response.data.chat._id);
        setShowHistory(false);
        toast.success("Chat loaded successfully");
      }
    } catch (error) {
      console.error("Error loading chat:", error);
      toast.error("Failed to load chat");
    }
  };

  const startNewChat = () => {
    const greetingMessage = {
      role: "assistant",
      content:
        "Hello! I'm EduConnect Assistant. How can I help you with Sindh Madarsatul Islam University today?",
      timestamp: new Date().toISOString(),
    };
    setMessages([greetingMessage]);
    setChatId(null);
    setShowHistory(false);
    toast.info("Started new chat");
  };

  const deleteChat = async (chatIdToDelete, e) => {
    e.stopPropagation(); // Prevent triggering loadChat
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/chats/${chatIdToDelete}`,
        { withCredentials: true },
      );
      loadChatHistory();
      toast.success("Chat deleted");

      // If we deleted the currently active chat, start a new one
      if (chatId === chatIdToDelete) {
        startNewChat();
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick questions suggestions
  const quickQuestions = [
    "How do I enroll in courses?",
    "How to check my marks?",
    "Lost my ID card, what should I do?",
    "Where is SMIU located?",
    "How to check my CGPA?",
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Fixed Sidebar - Desktop Only */}
      <div className="fixed left-0 h-screen hidden lg:flex flex-col w-64 border-r flex-shrink-0">
        {/* Sidebar Header */}
        <div
          className={`p-4 border-b ${
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-gray-900 border-gray-700"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span
                className={`font-bold ${
                  theme === "light" ? "text-blue-600" : "text-blue-400"
                }`}
              >
                EduConnect
              </span>
            </div>
          </div>

          <button
            onClick={startNewChat}
            className="w-full py-2.5 px-4 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New Chat</span>
          </button>
        </div>

        {/* Sidebar Chat History - Fixed height with custom scrollbar */}
        <div
          className="flex-1 p-4 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor:
              theme === "light" ? "#bfdbfe #f1f5f9" : "#4b5563 #1f2937",
          }}
        >
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm uppercase tracking-wider">
              Chat History
            </h3>
          </div>

          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <motion.div
                key={chat._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => loadChat(chat)}
                className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  chatId === chat._id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    : theme === "light"
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          chatId === chat._id ? "bg-white" : "bg-blue-500"
                        }`}
                      ></div>
                      <p className="font-medium truncate text-sm">
                        {chat.title}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p
                        className={`text-xs ${
                          chatId === chat._id
                            ? "text-blue-100"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {formatDate(chat.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteChat(chat._id, e)}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                      chatId === chat._id
                        ? "hover:bg-gray-500 text-white"
                        : theme === "light"
                          ? "hover:bg-gray-300 text-black"
                          : "text-white hover:bg-gray-300 hover:text-black"
                    }`}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
            {chatHistory.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  No chat history yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">
                  Start a conversation to see it here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:p-40"></div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b ">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">AI Study Assistant</h2>
                <p className="text-xs text-gray-500">SMIU University Helper</p>
              </div>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-4 py-2 rounded-lg font-medium ${
                theme === "light"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {showHistory ? "Chat" : "History"}
            </button>
          </div>
        </div>

        {/* Mobile History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-b"
            >
              <div
                className={`p-4 ${
                  theme === "light" ? "bg-gray-50" : "bg-gray-800"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Chat History</h3>
                  <button
                    onClick={startNewChat}
                    className="text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                  >
                    New Chat
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {chatHistory.map((chat) => (
                    <div
                      key={chat._id}
                      onClick={() => loadChat(chat)}
                      className={`p-3 rounded-lg cursor-pointer ${
                        chatId === chat._id
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                          : theme === "light"
                            ? "bg-gray-100 hover:bg-gray-200"
                            : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      <p className="font-medium truncate">{chat.title}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs opacity-75">
                          {formatDate(chat.updatedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Messages Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor:
              theme === "light" ? "#bfdbfe transparent" : "#4b5563 transparent",
          }}
        >
          <div className="max-w-3xl mx-auto">
            {/* Welcome Header - Only show when no user messages yet */}
            {messages.length === 1 && messages[0].role === "assistant" && (
              <div className="text-center mb-8 px-2 sm:px-0">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">❐</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  EduConnect Assistant
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base px-4">
                  How can I help you with Sindh Madarsatul Islam University
                  today?
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-6 px-2 sm:px-0">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`overflow-hidden max-w-[90%] sm:max-w-[85%] lg:max-w-[80%] rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : theme === "light"
                          ? "bg-white border border-gray-200 shadow-sm"
                          : "bg-gray-800 border border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === "user"
                            ? "bg-white/20"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600"
                        }`}
                      >
                        <span
                          className={
                            message.role === "user"
                              ? "text-white"
                              : "text-white"
                          }
                        >
                          {message.role === "user" ? "👤" : "🎓"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {message.role === "user"
                              ? "You"
                              : "EduConnect Assistant"}
                          </span>
                          <span className="text-xs opacity-75">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.role === "assistant" &&
                            containsURLs(message.content) && (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                Contains Links
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                      {parseMessageContent(message.content)}
                    </div>

                    {/* URL indicator for assistant messages */}
                    {message.role === "assistant" &&
                      containsURLs(message.content) && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            <span>Clickable links will open in a new tab</span>
                          </div>
                        </div>
                      )}
                  </div>
                </motion.div>
              ))}

              {/* Quick Questions - Only show at the beginning */}
              {messages.length <= 2 &&
                messages.every((msg) => msg.role === "assistant") && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 px-2 sm:px-0"
                  >
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm font-medium">
                      Try asking about:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((question, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setInputMessage(question);
                            inputRef.current?.focus();
                          }}
                          className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                            theme === "light"
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          {question}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start px-2 sm:px-0">
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      theme === "light"
                        ? "bg-white border border-gray-200 shadow-sm"
                        : "bg-gray-800 border border-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div
          className={`border-t p-4 sm:p-6 rounded-2xl ${
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-gray-900 border-gray-700"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about enrollment, marks, university procedures..."
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none resize-none pr-12 text-sm sm:text-base ${
                    theme === "light"
                      ? "bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-blue-500"
                      : "bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:border-blue-500"
                  }`}
                  rows="1"
                  disabled={isLoading}
                  style={{ minHeight: "48px", maxHeight: "120px" }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className={`absolute right-2 bottom-2 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all ${
                    isLoading || !inputMessage.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600"
                  } ${
                    inputMessage.trim()
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                      : theme === "light"
                        ? "bg-gray-300 text-gray-600"
                        : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
              <span className="text-xs sm:text-sm">
                Press Enter to send • Shift+Enter for new line
              </span>
              <span className="text-xs opacity-75">
                {messages.filter((m) => m.role === "user").length} user messages
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for elegant scrollbars */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === "light" ? "#f1f5f9" : "#1f2937"};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === "light" ? "#bfdbfe" : "#4b5563"};
          border-radius: 10px;
          transition: background 0.2s;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === "light" ? "#93c5fd" : "#6b7280"};
        }
        
        /* Firefox scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: ${
            theme === "light" ? "#bfdbfe #f1f5f9" : "#4b5563 #1f2937"
          };
        }

        /* URL link styling */
        a {
          text-decoration: none;
          cursor: pointer;
        }

        a:hover {
          text-decoration: none;
        }
      `}</style>
    </div>
  );
};

export default ChatbotTab;
