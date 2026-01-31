// src/pages/HomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import ChatbotTab from "../components/home/ChatbotTab";
import PostsTab from "../components/home/PostsTab";
import TeachersTab from "../components/home/TeachersTab";
import ProfileTab from "../components/home/ProfileTab";

function HomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("chatbot");

  const logoutUser = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
      toast.success("User logged out successfully.");
      navigate("/");
    } catch (err) {
      console.error("Error logging out", err);
      toast.error("Logout failed");
    }
  };

  // Navigation items with full text and emoji versions
  const navItems = [
    {
      id: "chatbot",
      label: "AI Chatbot",
      emoji: "⧉",
      icon: "⧉",
    },
    {
      id: "posts",
      label: "Post Area",
      emoji: "✎",
      icon: "✎",
    },
    {
      id: "teachers",
      label: "Teachers",
      emoji: "⬢",
      icon: "⬢",
    },
    {
      id: "profile",
      label: "Profile",
      emoji: "▣",
      icon: "▣",
    },
  ];

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "chatbot":
        return <ChatbotTab />;
      case "posts":
        return <PostsTab />;
      case "teachers":
        return <TeachersTab />;
      case "profile":
        return <ProfileTab logoutUser={logoutUser} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex flex-col ${
        theme === "light"
          ? "bg-gradient-to-br from-blue-50 to-indigo-50"
          : "bg-gradient-to-br from-gray-900 to-gray-800"
      }`}
    >
      {/* Desktop Navigation (Top - visible on md screens and above) */}
      <nav
        className={`hidden md:block sticky top-0 z-50 transition-colors duration-300 ${
          theme === "light"
            ? "bg-white/80 backdrop-blur-md border-b border-blue-200"
            : "bg-gray-800/80 backdrop-blur-md border-b border-gray-700"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span
                className={`text-2xl font-bold ${
                  theme === "light" ? "text-blue-600" : "text-blue-400"
                }`}
              >
                EduConnect
              </span>
            </div>

            {/* Desktop Navigation Items */}
            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : theme === "light"
                        ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        : "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Takes remaining space */}
      <main className="flex justify-center items-center container mx-auto pb-16 md:pb-6 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Mobile Navigation (Bottom - visible on screens smaller than md) */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-colors duration-300 ${
          theme === "light"
            ? "bg-white/90 backdrop-blur-md border-t border-blue-200 shadow-[0_-4px_20px_-6px_rgba(0,0,0,0.1)]"
            : "bg-gray-800/90 backdrop-blur-md border-t border-gray-700 shadow-[0_-4px_20px_-6px_rgba(0,0,0,0.3)]"
        }`}
      >
        {/* Mobile Navigation Items (Bottom part) */}
        <div className="flex items-center justify-around ">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 flex-1 mx-1 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                  : theme === "light"
                    ? "text-gray-700 hover:bg-blue-50"
                    : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        {/* Logo and Logout on Mobile (Top part of bottom nav) */}
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span
                className={`text-sm font-bold ${
                  theme === "light" ? "text-blue-600" : "text-blue-400"
                }`}
              >
                EduConnect
              </span>
            </div>

            <button
              onClick={logoutUser}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                theme === "light"
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-red-900/30 text-red-400 hover:bg-red-900/50"
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default HomePage;
