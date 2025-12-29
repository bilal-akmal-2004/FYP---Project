import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

function HomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("chatbot");

  const logoutUser = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
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
      emoji: "⧉", // looks like a tech/AI interface box
      icon: "⧉",
    },
    {
      id: "posts",
      label: "Post Area",
      emoji: "✎", // pencil / writing, slim and minimal
      icon: "✎",
    },
    {
      id: "teachers",
      label: "Teachers",
      emoji: "⬢", // hexagon for uniqueness, represents authority/structure
      icon: "⬢",
    },
    {
      id: "profile",
      label: "Profile",
      emoji: "▣", // square with inner square, feels “profile” or identity
      icon: "▣",
    },
  ];

  // Content for each tab
  const renderContent = () => {
    switch (activeTab) {
      case "chatbot":
        return (
          <div className="p-4 md:p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-3xl md:text-4xl">❐</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                AI Study Assistant
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
                Ask questions about courses, assignments, university procedures,
                and get instant AI-powered responses to help with your studies.
              </p>
            </div>

            {/* Chatbot Skeleton */}
            <div className="max-w-3xl mx-auto">
              <div
                className={`rounded-2xl p-4 md:p-6 mb-6 ${
                  theme === "light" ? "bg-gray-50" : "bg-gray-800"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm md:text-base">AI</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-2 text-sm md:text-base">
                      Study Assistant
                    </div>
                    <div
                      className={`h-3 md:h-4 w-3/4 rounded ${
                        theme === "light" ? "bg-gray-200" : "bg-gray-700"
                      } mb-2`}
                    ></div>
                    <div
                      className={`h-3 md:h-4 w-1/2 rounded ${
                        theme === "light" ? "bg-gray-200" : "bg-gray-700"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div
                  className={`w-full rounded-full px-4 md:px-6 py-3 md:py-4 ${
                    theme === "light"
                      ? "bg-gray-100 border border-gray-300"
                      : "bg-gray-700 border border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                      Type your question here...
                    </span>
                    <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white text-base md:text-lg">➤</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "posts":
        return (
          <div className="p-4 md:p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-3xl md:text-4xl">▤</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Academic Posts & Discussions
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
                Share academic resources, ask questions, and engage with fellow
                students in a collaborative learning environment.
              </p>
            </div>

            {/* Posts Skeleton */}
            <div className="max-w-3xl mx-auto">
              {/* Create Post Skeleton */}
              <div
                className={`rounded-2xl p-4 md:p-6 mb-6 ${
                  theme === "light" ? "bg-gray-50" : "bg-gray-800"
                }`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white">Y</span>
                  </div>
                  <div
                    className={`flex-1 h-10 md:h-12 rounded-lg ${
                      theme === "light" ? "bg-gray-200" : "bg-gray-700"
                    }`}
                  ></div>
                </div>
                <div className="flex justify-end space-x-4">
                  <div
                    className={`w-20 md:w-24 h-8 md:h-10 rounded-lg ${
                      theme === "light" ? "bg-gray-200" : "bg-gray-700"
                    }`}
                  ></div>
                  <div
                    className={`w-20 md:w-24 h-8 md:h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600`}
                  ></div>
                </div>
              </div>

              {/* Posts List Skeleton */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`rounded-2xl p-4 md:p-6 mb-4 ${
                    theme === "light"
                      ? "bg-white border border-gray-200"
                      : "bg-gray-800 border border-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm md:text-base">
                        S{item}
                      </span>
                    </div>
                    <div>
                      <div
                        className={`h-3 md:h-4 w-28 md:w-32 rounded ${
                          theme === "light" ? "bg-gray-200" : "bg-gray-700"
                        } mb-2`}
                      ></div>
                      <div
                        className={`h-2 md:h-3 w-20 md:w-24 rounded ${
                          theme === "light" ? "bg-gray-200" : "bg-gray-700"
                        }`}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div
                      className={`h-3 md:h-4 w-full rounded ${
                        theme === "light" ? "bg-gray-200" : "bg-gray-700"
                      } mb-2`}
                    ></div>
                    <div
                      className={`h-3 md:h-4 w-2/3 rounded ${
                        theme === "light" ? "bg-gray-200" : "bg-gray-700"
                      }`}
                    ></div>
                  </div>
                  <div className="flex space-x-4">
                    <div
                      className={`w-14 md:w-16 h-6 md:h-8 rounded ${
                        theme === "light" ? "bg-gray-200" : "bg-gray-700"
                      }`}
                    ></div>
                    <div
                      className={`w-14 md:w-16 h-6 md:h-8 rounded ${
                        theme === "light" ? "bg-gray-200" : "bg-gray-700"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "teachers":
        return (
          <div className="p-4 md:p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-3xl md:text-4xl">⬢</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Connect with Teachers
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
                Chat directly with your teachers, ask questions about courses,
                and get personalized academic guidance.
              </p>
            </div>

            {/* Teachers List Skeleton */}
            <div className="max-w-3xl mx-auto">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className={`flex items-center justify-between p-3 md:p-4 mb-4 rounded-2xl ${
                    theme === "light"
                      ? "bg-white border border-gray-200"
                      : "bg-gray-800 border border-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-base md:text-xl">
                        T{item}
                      </span>
                    </div>
                    <div>
                      <div
                        className={`h-4 md:h-5 w-28 md:w-32 rounded ${
                          theme === "light" ? "bg-gray-200" : "bg-gray-700"
                        } mb-2`}
                      ></div>
                      <div
                        className={`h-2 md:h-3 w-20 md:w-24 rounded ${
                          theme === "light" ? "bg-gray-200" : "bg-gray-700"
                        }`}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={`w-20 md:w-24 h-8 md:h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="p-4 md:p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-3xl md:text-4xl">👤</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Your Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
                Manage your account settings, academic preferences, and personal
                information.
              </p>
            </div>

            {/* Profile Skeleton */}
            <div className="max-w-3xl mx-auto">
              <div
                className={`rounded-2xl p-4 md:p-6 mb-6 ${
                  theme === "light"
                    ? "bg-white border border-gray-200"
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                <div className="flex items-center space-x-4 md:space-x-6 mb-6 md:mb-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl md:text-2xl">JD</span>
                  </div>
                  <div className="flex-1">
                    <div
                      className={`h-5 md:h-6 w-40 md:w-48 rounded ${
                        theme === "light" ? "bg-gray-200" : "bg-gray-700"
                      } mb-4`}
                    ></div>
                    <div
                      className={`h-3 md:h-4 w-28 md:w-32 rounded ${
                        theme === "light" ? "bg-gray-200" : "bg-gray-700"
                      } mb-2`}
                    ></div>
                    <div
                      className={`h-3 md:h-4 w-36 md:w-40 rounded ${
                        theme === "light" ? "bg-gray-200" : "bg-gray-700"
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Profile Sections */}
                {[
                  "Academic Details",
                  "Account Settings",
                  "Notification Preferences",
                  "Privacy",
                ].map((section, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 md:p-4 mb-3 rounded-lg ${
                      theme === "light" ? "bg-gray-50" : "bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs md:text-sm">→</span>
                      </div>
                      <div
                        className={`h-4 md:h-5 w-28 md:w-32 rounded ${
                          theme === "light" ? "bg-gray-200" : "bg-gray-600"
                        }`}
                      ></div>
                    </div>
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-blue-500"></div>
                  </div>
                ))}

                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={logoutUser}
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-300 text-sm md:text-base ${
                      theme === "light"
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                    }`}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

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

              {/* Logout Button */}
              {/* <button
                onClick={logoutUser}
                className={`ml-4 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                  theme === "light"
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                }`}
              >
                Logout
              </button> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Takes remaining space */}
      <main className="flex-1 container mx-auto pb-16 md:pb-6 overflow-y-auto">
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
        <div className="flex items-center justify-around px-2 py-2">
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
