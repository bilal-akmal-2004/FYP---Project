// src/components/home/ProfileTab.jsx
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AiOutlineCamera, AiOutlineLogout } from "react-icons/ai";

const ProfileTab = ({ logoutUser }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  // Load profile picture from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem("userProfilePicture");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Function to compress/resize image for localStorage
  const compressImageForStorage = (
    file,
    maxWidth = 300,
    maxHeight = 300,
    quality = 0.6,
  ) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with low quality for localStorage
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);

          // Check if compressed size is acceptable for localStorage (max ~5MB per domain)
          const approxSize = Math.round(compressedBase64.length * 0.75);
          console.log("Compressed image size:", approxSize, "bytes");

          if (approxSize > 1024 * 1024) {
            // If > 1MB
            toast.warning("Image compressed to save space");
          }

          resolve(compressedBase64);
        };

        img.onerror = (error) => reject(error);
      };

      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    setLoading(true);
    try {
      // Compress image for localStorage
      const compressedBase64 = await compressImageForStorage(
        file,
        300,
        300,
        0.6,
      );

      // Save to localStorage
      localStorage.setItem("userProfilePicture", compressedBase64);

      // Update state
      setProfileImage(compressedBase64);

      toast.success("Profile picture saved!");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
    } finally {
      setLoading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    // Remove from localStorage
    localStorage.removeItem("userProfilePicture");

    // Clear state
    setProfileImage(null);

    toast.info("Profile picture removed");
  };

  // Get user's first letter for default avatar
  const getUserInitial = () => {
    // You can get this from your auth context or props
    const userName = "User"; // Default
    return userName.charAt(0).toUpperCase();
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="relative w-48 h-48 mx-auto mb-8"
        >
          <div className="relative w-full h-full">
            {/* Profile Image */}
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center ${
                    theme === "light"
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                      : "bg-gradient-to-br from-blue-700 to-indigo-800"
                  }`}
                >
                  <span className="text-5xl text-white font-bold">
                    {getUserInitial()}
                  </span>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className={`absolute bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:scale-110 active:scale-95"
              } ${
                profileImage
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
              } text-white`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <AiOutlineCamera className="w-6 h-6" />
              )}
            </button>

            {/* Remove Button (only shows when there's an image) */}
            {profileImage && !loading && (
              <button
                onClick={handleRemoveImage}
                className={`absolute bottom-4 left-4 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 bg-gradient-to-r from-red-500 to-pink-600 text-white`}
              >
                <svg
                  className="w-6 h-6"
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
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
              disabled={loading}
            />
          </div>
        </motion.div>

        <h2 className="text-2xl md:text-3xl font-bold mb-3">Your Profile</h2>
        <p
          className={`max-w-md mx-auto text-sm md:text-base ${
            theme === "light" ? "text-gray-600" : "text-gray-300"
          }`}
        >
          {loading
            ? "Processing your profile picture..."
            : profileImage
              ? "Profile picture saved locally!"
              : "Upload a profile picture (saved in browser)"}
        </p>

        {/* Storage Info */}
        <div className="mt-6 max-w-md mx-auto">
          <div
            className={`p-4 rounded-xl text-sm ${
              theme === "light"
                ? "bg-blue-50 text-blue-700"
                : "bg-blue-900/30 text-blue-300"
            }`}
          >
            <p className="font-medium mb-2">💾 Local Storage Info:</p>
            <ul className="space-y-1 text-sm">
              <li>• Images saved in your browser only</li>
              <li>• Auto-compressed to 300x300px</li>
              <li>• Works offline</li>
              <li>• Private to this device</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-md mx-auto mt-12"
      >
        <div
          className={`p-6 rounded-2xl mb-6 ${
            theme === "light"
              ? "bg-gradient-to-r from-red-50 to-pink-50 border border-red-100"
              : "bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-900/30"
          }`}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center">
              <AiOutlineLogout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Ready to Leave?</h3>
              <p
                className={`text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Sign out from your account
              </p>
            </div>
          </div>

          <button
            onClick={logoutUser}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-medium transition-all duration-300 text-lg flex items-center justify-center space-x-3 ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:shadow-lg active:scale-[0.98]"
            } ${
              theme === "light"
                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700"
                : "bg-gradient-to-r from-red-600 to-pink-700 text-white hover:from-red-700 hover:to-pink-800"
            }`}
          >
            <AiOutlineLogout className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center">
          <p
            className={`text-sm ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            EduConnect • Student Portal
          </p>
          <p
            className={`text-xs mt-1 ${
              theme === "light" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Profile pictures saved locally in your browser
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileTab;
