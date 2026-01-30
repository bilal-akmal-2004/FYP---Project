// src/components/home/PostsTab.jsx
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

// Separate UploadModal Component
const UploadModal = memo(
  ({
    isOpen,
    onClose,
    theme,
    newPost,
    setNewPost,
    fileInputRef,
    handleImageSelect,
    removeImage,
    handleSubmitPost,
    isUploading,
    uploadProgress,
  }) => {
    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className={`rounded-3xl w-full max-w-lg ${
              theme === "light"
                ? "bg-gradient-to-b from-white to-gray-50 shadow-2xl"
                : "bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-7 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg
                      className="w-5 h-5 text-white"
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
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Create New Post
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Share with your academic community
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-xl transition-all ${
                    theme === "light"
                      ? "hover:bg-gray-100 text-gray-500"
                      : "hover:bg-gray-700 text-gray-400"
                  }`}
                  disabled={isUploading}
                >
                  <svg
                    className="w-5 h-5"
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
            </div>

            {/* Modal Content */}
            <div className="p-7">
              {/* Upload Progress Bar */}
              {isUploading && uploadProgress > 0 && (
                <div className="mb-7">
                  <div className="flex justify-between text-sm mb-2">
                    <span
                      className={`font-medium ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      Uploading...
                    </span>
                    <span className="font-bold text-blue-600">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div
                    className={`w-full rounded-full h-2 ${
                      theme === "light" ? "bg-gray-200" : "bg-gray-700"
                    }`}
                  >
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300 shadow-md"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Image Upload Area */}
              <div className="mb-7">
                {!newPost.imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-3 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                      theme === "light"
                        ? "border-gray-200 hover:border-blue-400 bg-gradient-to-b from-gray-50 to-white hover:from-blue-50 hover:to-blue-50"
                        : "border-gray-600 hover:border-blue-500 bg-gradient-to-b from-gray-800 to-gray-900 hover:from-blue-900/20 hover:to-blue-900/20"
                    }`}
                  >
                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <p
                      className={`font-semibold mb-2 text-lg ${
                        theme === "light" ? "text-gray-800" : "text-gray-200"
                      }`}
                    >
                      Upload Image
                    </p>
                    <p
                      className={`text-sm mb-1 ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Drag & drop or click to browse
                    </p>
                    <p
                      className={`text-xs ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      JPG, PNG, GIF up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-2xl shadow-xl">
                      <img
                        src={newPost.imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover transform group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      {newPost.image && (
                        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                          {(newPost.image.size / (1024 * 1024)).toFixed(1)} MB
                        </div>
                      )}
                    </div>
                    <button
                      onClick={removeImage}
                      className="absolute top-3 right-3 w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full flex items-center justify-center hover:from-red-600 hover:to-pink-700 shadow-lg transform hover:scale-110 transition-all duration-200"
                      disabled={isUploading}
                    >
                      <svg
                        className="w-5 h-5"
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
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                />
              </div>

              {/* Description Input */}
              <div className="mb-6">
                <label
                  className={`block text-sm font-semibold mb-3 ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Description
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={newPost.description}
                    onChange={(e) =>
                      setNewPost({ ...newPost, description: e.target.value })
                    }
                    placeholder="Share your thoughts, questions, or academic resources..."
                    className={`w-full px-5 py-4 rounded-xl focus:outline-none resize-none text-base leading-relaxed ${
                      theme === "light"
                        ? "bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        : "bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/30"
                    }`}
                    rows="3"
                    disabled={isUploading}
                  />
                  <div className="absolute bottom-3 right-3">
                    <span
                      className={`text-xs ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {newPost.description.length}/500
                    </span>
                  </div>
                </div>
              </div>

              {/* Link Input */}
              <div className="mb-8">
                <label
                  className={`block text-sm font-semibold mb-3 ${
                    theme === "light" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Link (Optional)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                  </div>
                  <input
                    type="text"
                    value={newPost.link}
                    onChange={(e) =>
                      setNewPost({ ...newPost, link: e.target.value })
                    }
                    placeholder="https://example.com/resource"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none text-base ${
                      theme === "light"
                        ? "bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        : "bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/30"
                    }`}
                    disabled={isUploading}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                    theme === "light"
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                  }`}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPost}
                  disabled={
                    isUploading ||
                    (!newPost.description.trim() && !newPost.image)
                  }
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 ${
                    isUploading ||
                    (!newPost.description.trim() && !newPost.image)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-blue-600 hover:to-indigo-700"
                  } bg-gradient-to-r from-blue-500 to-indigo-600 text-white`}
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>
                        {uploadProgress === 100
                          ? "Processing..."
                          : "Uploading..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Post Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  },
);

UploadModal.displayName = "UploadModal";

// Comment Section Component
const CommentSection = memo(({ postId, theme, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentsEndRef = useRef(null);

  const loadComments = useCallback(async () => {
    if (!isOpen) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/${postId}/comments`,
        { withCredentials: true },
      );
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  }, [postId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [loadComments, isOpen]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/${postId}/comments`,
        { content: newComment.trim() },
        { withCredentials: true },
      );

      if (response.data.success) {
        setComments((prev) => [response.data.comment, ...prev]);
        setNewComment("");
        toast.success("Comment added!");

        // Scroll to bottom
        setTimeout(() => {
          commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const formatCommentTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "Recently";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4`}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className={`rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col ${
            theme === "light"
              ? "bg-gradient-to-b from-white to-gray-50"
              : "bg-gradient-to-b from-gray-800 to-gray-900"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`p-6 border-b ${theme === "light" ? "border-gray-200" : "border-gray-700"}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                <div>
                  <h3 className="font-bold text-lg">Comments</h3>
                  <p
                    className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {comments.length} comment{comments.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"}`}
              >
                <svg
                  className="w-5 h-5"
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
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex space-x-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {comment.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm">
                          {comment.user?.name || "Anonymous"}
                        </span>
                        <span
                          className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
                        >
                          {formatCommentTime(comment.createdAt)}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                      >
                        {comment.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={commentsEndRef} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
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
                <p
                  className={`text-lg font-medium ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                >
                  No comments yet
                </p>
                <p
                  className={`text-sm mt-1 ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}
                >
                  Be the first to comment!
                </p>
              </div>
            )}
          </div>

          {/* Add Comment Input */}
          <div
            className={`p-6 border-t ${theme === "light" ? "border-gray-200" : "border-gray-700"}`}
          >
            <div className="flex space-x-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a comment..."
                className={`flex-1 px-4 py-3 rounded-xl focus:outline-none resize-none text-sm ${
                  theme === "light"
                    ? "bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-blue-500"
                    : "bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500"
                }`}
                rows="2"
                disabled={isSubmitting}
              />
              <button
                onClick={handleSubmitComment}
                disabled={isSubmitting || !newComment.trim()}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  isSubmitting || !newComment.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-blue-600 hover:to-indigo-700"
                } bg-gradient-to-r from-blue-500 to-indigo-600 text-white self-end`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

CommentSection.displayName = "CommentSection";

// Image Compression Function
const compressImageNative = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    reader.readAsDataURL(file);
    reader.onload = (e) => {
      img.src = e.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 1200;

        if (width > height && width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.7;
        if (file.size > 5 * 1024 * 1024) quality = 0.5;
        else if (file.size > 2 * 1024 * 1024) quality = 0.6;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality,
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

// Main PostsTab Component
const PostsTab = () => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newPost, setNewPost] = useState({
    description: "",
    link: "",
    image: null,
    imagePreview: null,
  });
  const [likingPostId, setLikingPostId] = useState(null);
  const [commentingPostId, setCommentingPostId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts`,
        { withCredentials: true },
      );
      if (response.data.success) {
        setPosts(
          response.data.posts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          ),
        );
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file");
        return;
      }
      setNewPost((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  }, []);

  const removeImage = useCallback(() => {
    if (newPost.imagePreview) {
      URL.revokeObjectURL(newPost.imagePreview);
    }
    setNewPost((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
  }, [newPost.imagePreview]);

  const handleSubmitPost = useCallback(async () => {
    if (!newPost.description.trim() && !newPost.image) {
      toast.error("Please add a description or image");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      if (newPost.description.trim()) {
        formData.append("description", newPost.description.trim());
      }
      if (newPost.link.trim()) {
        formData.append("link", newPost.link.trim());
      }
      if (newPost.image) {
        try {
          if (newPost.image.size > 1 * 1024 * 1024) {
            const compressedFile = await compressImageNative(newPost.image);
            formData.append("image", compressedFile, compressedFile.name);
          } else {
            formData.append("image", newPost.image, newPost.image.name);
          }
        } catch (error) {
          formData.append("image", newPost.image, newPost.image.name);
        }
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/create`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              setUploadProgress(
                Math.round((progressEvent.loaded * 100) / progressEvent.total),
              );
            }
          },
          timeout: 30000,
        },
      );

      if (response.data.success) {
        toast.success("Post created successfully!");
        setPosts((prev) => [response.data.post, ...prev]);
        resetForm();
        setShowUploadModal(false);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.code === "ECONNABORTED") {
        toast.error("Upload timeout. Try a smaller image.");
      } else if (error.response?.status === 413) {
        toast.error("Image is too large. Try a smaller image.");
      } else {
        toast.error(error.response?.data?.msg || "Failed to create post");
      }
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [newPost]);

  const resetForm = useCallback(() => {
    if (newPost.imagePreview) {
      URL.revokeObjectURL(newPost.imagePreview);
    }
    setNewPost({
      description: "",
      link: "",
      image: null,
      imagePreview: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [newPost.imagePreview]);

  const likePost = async (postId) => {
    if (likingPostId === postId) return;

    setLikingPostId(postId);

    const post = posts.find((p) => p._id === postId);
    if (!post) return;

    const wasLiked = post.isLiked;
    const newLikeCount = wasLiked ? post.likes - 1 : post.likes + 1;

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, isLiked: !wasLiked, likes: newLikeCount }
          : p,
      ),
    );

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/${postId}/like`,
        {},
        {
          withCredentials: true,
          timeout: 5000,
        },
      );

      if (response.data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  likes: response.data.likes,
                  isLiked: response.data.isLiked,
                }
              : p,
          ),
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, isLiked: wasLiked, likes: post.likes } : p,
        ),
      );
      toast.error("Failed to like post");
    } finally {
      setLikingPostId(null);
    }
  };

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "Recently";
    }
  };

  const handleLinkClick = (e, url) => {
    e.stopPropagation();
    if (url && !url.startsWith("http")) {
      window.open(`https://${url}`, "_blank");
    } else {
      window.open(url, "_blank");
    }
  };

  const handleCommentClick = (postId) => {
    setCommentingPostId(postId);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        theme={theme}
        newPost={newPost}
        setNewPost={setNewPost}
        fileInputRef={fileInputRef}
        handleImageSelect={handleImageSelect}
        removeImage={removeImage}
        handleSubmitPost={handleSubmitPost}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
      />

      {/* Comment Section Modal */}
      <CommentSection
        postId={commentingPostId}
        theme={theme}
        isOpen={!!commentingPostId}
        onClose={() => setCommentingPostId(null)}
      />

      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-4xl md:text-5xl">📚</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Academic Community
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg md:text-xl">
          Share knowledge, ask questions, and connect with fellow learners
        </p>
      </div>

      {/* Create Post Button */}
      <div className="max-w-3xl mx-auto mb-10">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowUploadModal(true)}
          className={`w-full rounded-2xl p-5 md:p-6 flex items-center justify-between shadow-lg hover:shadow-xl transition-all duration-300 ${
            theme === "light"
              ? "bg-gradient-to-r from-white to-gray-50 border border-gray-200 hover:border-blue-300"
              : "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500"
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-md"></div>
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">+</span>
              </div>
            </div>
            <div className="text-left">
              <p
                className={`font-bold text-lg ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                Create New Post
              </p>
              <p
                className={`text-sm ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Share your thoughts with the community
              </p>
            </div>
          </div>
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </motion.button>
      </div>

      {/* Posts List - VERTICAL LAYOUT */}
      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`rounded-3xl p-6 ${
                  theme === "light"
                    ? "bg-gradient-to-b from-white to-gray-50 border border-gray-200"
                    : "bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700"
                }`}
              >
                <div className="animate-pulse">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gray-300 dark:bg-gray-700"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <div className="w-20 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    <div className="w-20 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className={`group rounded-3xl p-6 transition-all duration-300 ${
                  theme === "light"
                    ? "bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-2xl"
                    : "bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500 hover:shadow-2xl"
                }`}
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur"></div>
                      <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {post.user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200">
                        {post.user?.name || "Anonymous"}
                      </p>
                      <p
                        className={`text-sm ${
                          theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {formatTime(post.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                {post.description && (
                  <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {post.description}
                  </p>
                )}

                {/* Post Image */}
                {post.imageUrl && (
                  <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={post.imageUrl}
                      alt="Post content"
                      className="w-full h-64 md:h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Post Link */}
                {post.link && (
                  <div className="mb-6">
                    <button
                      onClick={(e) => handleLinkClick(e, post.link)}
                      className={`w-full p-4 rounded-xl flex items-center space-x-4 transition-all group/link ${
                        theme === "light"
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200"
                          : "bg-gradient-to-r from-blue-900/30 to-indigo-900/30 hover:from-blue-900/50 hover:to-indigo-900/50 border border-blue-800"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
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
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                        <p className="font-semibold text-sm truncate text-gray-800 dark:text-gray-200">
                          {post.link
                            .replace(/^https?:\/\//, "")
                            .replace(/^www\./, "")}
                        </p>
                        <p
                          className={`text-xs ${
                            theme === "light"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          Click to visit
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-blue-500 transform group-hover/link:translate-x-1 transition-transform"
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
                    </button>
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => likePost(post._id)}
                    disabled={likingPostId === post._id}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                      post.isLiked
                        ? "bg-gradient-to-r from-red-50 to-pink-50 text-red-600 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-400"
                        : theme === "light"
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${
                        post.isLiked ? "scale-110" : ""
                      }`}
                      fill={post.isLiked ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{post.likes || 0}</span>
                  </button>

                  <button
                    onClick={() => handleCommentClick(post._id)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                      theme === "light"
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
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
                    <span>Comment</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              No posts yet
            </h3>
            <p
              className={`mb-8 text-lg ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Be the first to share knowledge with the community!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Sharing
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsTab;
