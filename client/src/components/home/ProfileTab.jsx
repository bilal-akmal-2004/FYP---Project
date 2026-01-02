// src/components/home/ProfileTab.jsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

const ProfileTab = ({ logoutUser }) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-3xl md:text-4xl">👤</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Your Profile</h2>
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
};

export default ProfileTab;
