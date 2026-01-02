// src/components/home/TeachersTab.jsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

const TeachersTab = () => {
  const { theme } = useTheme();

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
          Chat directly with your teachers, ask questions about courses, and get
          personalized academic guidance.
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
                <span className="text-white text-base md:text-xl">T{item}</span>
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
};

export default TeachersTab;
