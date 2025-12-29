// src/components/ThemeToggle.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useState, useRef, useEffect } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close panel after delay on mobile
  useEffect(() => {
    if (isMobile && isOpen && !isHovered) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isMobile, isOpen, isHovered]);

  // Handle clicks outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMainButtonClick = () => {
    if (isMobile) {
      // On mobile, just toggle theme directly
      toggleTheme();
    } else {
      // On desktop, toggle theme and open panel
      toggleTheme();
      setIsOpen(true);

      // Auto-close after 2 seconds
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (!isHovered) {
          setIsOpen(false);
        }
      }, 2000);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isMobile) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isMobile) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (!isHovered) {
          setIsOpen(false);
        }
      }, 300);
    }
  };

  // Reset hover timer when panel is interacted with
  const handlePanelInteraction = () => {
    if (!isMobile) {
      clearTimeout(timeoutRef.current);
      setIsHovered(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed z-50"
      style={{
        bottom: isMobile ? "16px" : "20px",
        left: isMobile ? "16px" : "20px",
      }}
    >
      {/* Main Toggle Button - Always visible */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleMainButtonClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          relative rounded-full shadow-xl
          ${isMobile ? "w-10 h-10" : "w-12 h-12"}
          ${
            theme === "light"
              ? "bg-gradient-to-br bg-yellow-400 to-yellow-700"
              : "bg-gradient-to-br from-gray-800 to-gray-900"
          }
          transition-all duration-200
          flex items-center justify-center
          border-2 ${
            theme === "light" ? "border-yellow-200" : "border-gray-700"
          }
        `}
      >
        {/* Pulse effect when not hovered */}
        {!isHovered && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full border-2 border-yellow-400/30 dark:border-gray-400/30"
          />
        )}

        {/* Sun/Moon Icon */}
        <motion.div
          key={theme}
          initial={false}
          animate={{
            rotate: isHovered ? 360 : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 200,
          }}
          className="relative z-10"
        >
          {theme === "light" ? (
            // Sun icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={isMobile ? "w-5 h-5" : "w-6 h-6"}
              style={{
                color: "#fbbf24", // Yellow color for sun
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414-1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
          ) : (
            // Moon icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={isMobile ? "w-5 h-5" : "w-6 h-6"}
              style={{
                color: "#60a5fa", // Blue color for moon
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
            </svg>
          )}
        </motion.div>

        {/* Glow effect on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1.3 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute inset-0 rounded-full blur-md ${
              theme === "light" ? "bg-yellow-300/50" : "bg-blue-400/30"
            }`}
          />
        )}
      </motion.button>

      {/* Theme Panel - Opens on hover/click */}
      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute left-0 bottom-full mb-3
              p-3 rounded-xl shadow-2xl backdrop-blur-md
              ${
                theme === "light"
                  ? "bg-white/95 border border-yellow-100"
                  : "bg-gray-900/95 border border-gray-700"
              }
              min-w-[180px]
            `}
            onMouseEnter={handlePanelInteraction}
            onMouseLeave={handleMouseLeave}
          >
            {/* Current Theme Display */}
            <div className="mb-3">
              <div
                className={`text-sm font-semibold ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                Current Theme
              </div>
              <div
                className={`text-xs ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {theme === "light" ? "Light Mode" : "Dark Mode"}
              </div>
            </div>

            {/* Theme Options */}
            <div className="space-y-2">
              {/* Light Theme Option */}
              <button
                onClick={() => {
                  if (theme !== "light") {
                    toggleTheme();
                  }
                }}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                  theme === "light"
                    ? "bg-yellow-50 border border-yellow-200"
                    : "hover:bg-gray-800"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center bg-yellow-500`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414-1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464M12 8a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <div
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-yellow-700" : "text-gray-300"
                    }`}
                  >
                    Light
                  </div>
                  <div className="text-xs text-gray-500">Bright theme</div>
                </div>
              </button>

              {/* Dark Theme Option */}
              <button
                onClick={() => {
                  if (theme !== "dark") {
                    toggleTheme();
                  }
                }}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                  theme === "dark"
                    ? "bg-gray-800 border border-gray-700"
                    : "hover:bg-gray-800"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-blue-400" : "text-gray-300"
                    }`}
                  >
                    Dark
                  </div>
                  <div className="text-xs text-gray-500">Easy on eyes</div>
                </div>
              </button>
            </div>

            {/* Quick Settings */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Quick Settings
              </div>
              <div className="flex space-x-2">
                <button
                  className={`flex-1 text-xs text-center p-2 rounded-lg transition-colors
    ${
      theme === "light"
        ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
        : "bg-gray-800 hover:bg-gray-700 text-gray-200"
    }
  `}
                  onClick={() => {
                    const prefersDark = window.matchMedia(
                      "(prefers-color-scheme: dark)"
                    ).matches;
                    if (prefersDark !== (theme === "dark")) {
                      toggleTheme();
                    }
                  }}
                >
                  Auto
                </button>
                <button
                  className={`flex-1 text-xs text-center p-2 rounded-lg transition-colors
    ${
      theme === "light"
        ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
        : "bg-gray-800 hover:bg-gray-700 text-gray-200"
    }
  `}
                  onClick={() => {
                    localStorage.removeItem("theme");
                    window.location.reload();
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Tooltip */}
      {isMobile && isHovered && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap"
        >
          {theme === "light" ? "Switch to Dark" : "Switch to Light"}
        </motion.div>
      )}
    </div>
  );
}
