// src/components/home/PostsTab.jsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

const PostsTab = () => {
  const { theme } = useTheme();

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
                <span className="text-white text-sm md:text-base">S{item}</span>
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
};

export default PostsTab;
