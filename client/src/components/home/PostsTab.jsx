// src/components/home/PostsTab.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const PostsTab = () => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newPost, setNewPost] = useState({
    description: "",
    link: "",
    image: null,
    imagePreview: null,
  });
  const fileInputRef = useRef(null);

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts`,
        { withCredentials: true }
      );
      if (response.data.success) {
        // Sort posts by creation date (newest first)
        const sortedPosts = response.data.posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
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

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      setNewPost({
        ...newPost,
        image: file,
        imagePreview: previewUrl,
      });
    }
  };

  const removeImage = () => {
    if (newPost.imagePreview) {
      URL.revokeObjectURL(newPost.imagePreview);
    }
    setNewPost({
      ...newPost,
      image: null,
      imagePreview: null,
    });
  };

  const handleSubmitPost = async () => {
    if (!newPost.description.trim() && !newPost.image) {
      toast.error("Please add a description or image");
      return;
    }

    setIsUploading(true);
    try {
      // Convert image to base64 if exists
      let imageBase64 = null;
      if (newPost.image) {
        imageBase64 = await convertToBase64(newPost.image);
      }

      // Save post to database
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/create`,
        {
          description: newPost.description.trim(),
          link: newPost.link.trim(),
          image: imageBase64,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Post created successfully!");

        // Add new post to the beginning of the list
        setPosts([response.data.post, ...posts]);

        // Reset form and close modal
        resetForm();
        setShowUploadModal(false);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.response?.data?.msg || "Failed to create post");
    } finally {
      setIsUploading(false);
    }
  };

  // Convert image file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const resetForm = () => {
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
  };

  const likePost = async (postId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update the post in the state
        setPosts(
          posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: response.data.likes,
                  isLiked: response.data.isLiked,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
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

  // Upload Modal Component
  const UploadModal = () => (
    <AnimatePresence>
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={`rounded-2xl w-full max-w-md ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b ${
                theme === "light" ? "border-gray-200" : "border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Create New Post</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className={`p-2 rounded-lg ${
                    theme === "light"
                      ? "hover:bg-gray-100"
                      : "hover:bg-gray-700"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image Upload Area */}
              <div className="mb-6">
                {!newPost.imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                      theme === "light"
                        ? "border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50"
                        : "border-gray-600 hover:border-blue-500 bg-gray-900 hover:bg-blue-900/20"
                    }`}
                  >
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <p className="font-medium mb-2">Upload Image</p>
                    <p
                      className={`text-sm ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Click to select or drag & drop
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Supports JPG, PNG up to 5MB
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={newPost.imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
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
                />
              </div>

              {/* Description Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={newPost.description}
                  onChange={(e) =>
                    setNewPost({ ...newPost, description: e.target.value })
                  }
                  placeholder="What's on your mind? Share academic resources, questions, or announcements..."
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none resize-none text-sm ${
                    theme === "light"
                      ? "bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-blue-500"
                      : "bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:border-blue-500"
                  }`}
                  rows="3"
                />
              </div>

              {/* Link Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Link (Optional)
                </label>
                <input
                  type="text"
                  value={newPost.link}
                  onChange={(e) =>
                    setNewPost({ ...newPost, link: e.target.value })
                  }
                  placeholder="https://example.com"
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none text-sm ${
                    theme === "light"
                      ? "bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-blue-500"
                      : "bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    theme === "light"
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
                  className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                    isUploading ||
                    (!newPost.description.trim() && !newPost.image)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-blue-600 hover:to-indigo-700"
                  } bg-gradient-to-r from-blue-500 to-indigo-600 text-white`}
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
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
                      <span>Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="p-4 md:p-8">
      <UploadModal />

      <div className="text-center mb-8">
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-3xl md:text-4xl">📝</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Academic Posts & Discussions
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
          Share academic resources, ask questions, and engage with fellow
          students in a collaborative learning environment.
        </p>
      </div>

      {/* Create Post Button */}
      <div className="max-w-3xl mx-auto mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowUploadModal(true)}
          className={`w-full rounded-2xl p-4 md:p-6 flex items-center justify-between ${
            theme === "light"
              ? "bg-white border border-gray-200 hover:border-blue-300"
              : "bg-gray-800 border border-gray-700 hover:border-blue-500"
          } transition-all duration-200`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white">+</span>
            </div>
            <div>
              <p
                className={`font-medium text-left ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                Create a new post
              </p>
              <p
                className={`text-sm text-left ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Share images, links, or start a discussion
              </p>
            </div>
          </div>
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </motion.button>
      </div>

      {/* Posts List */}
      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          // Loading Skeleton
          <>
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
          </>
        ) : posts.length > 0 ? (
          // Actual Posts
          posts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-4 md:p-6 mb-4 ${
                theme === "light"
                  ? "bg-white border border-gray-200"
                  : "bg-gray-800 border border-gray-700"
              }`}
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">
                      {post.user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {post.user?.name || "Anonymous User"}
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
                <p className="mb-4 whitespace-pre-wrap">{post.description}</p>
              )}

              {/* Post Image */}
              {post.imageUrl && (
                <div className="mb-4">
                  <img
                    src={post.imageUrl}
                    alt="Post content"
                    className="w-full h-auto max-h-96 object-cover rounded-xl"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Post Link */}
              {post.link && (
                <div className="mb-4">
                  <button
                    onClick={(e) => handleLinkClick(e, post.link)}
                    className={`w-full p-3 rounded-xl flex items-center space-x-3 transition-all ${
                      theme === "light"
                        ? "bg-blue-50 hover:bg-blue-100 border border-blue-200"
                        : "bg-blue-900/30 hover:bg-blue-900/50 border border-blue-800"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
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
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm truncate">
                        {post.link
                          .replace(/^https?:\/\//, "")
                          .replace(/^www\./, "")}
                      </p>
                      <p
                        className={`text-xs ${
                          theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Click to open link
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-blue-500"
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
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => likePost(post._id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    post.isLiked
                      ? "text-red-500"
                      : theme === "light"
                      ? "text-gray-600 hover:text-red-500 hover:bg-red-50"
                      : "text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
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
                  <span className="font-medium">{post.likes || 0}</span>
                </button>

                <button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    theme === "light"
                      ? "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
                      : "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
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
                  <span className="font-medium">Comment</span>
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          // No Posts Message
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
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
            <h3 className="text-xl font-bold mb-2">No posts yet</h3>
            <p
              className={`mb-6 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Be the first to share something with the community!
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              Create First Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsTab;
