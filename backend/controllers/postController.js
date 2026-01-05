import Post from "../models/Post.js";
import Like from "../models/Like.js";
import cloudinary from "../config/cloudinary.js";

// Create a new post with base64 image
export const createPost = async (req, res) => {
  try {
    const { description, link, image } = req.body;
    let imageUrl = null;

    // Upload image to Cloudinary if provided
    if (image) {
      try {
        const result = await cloudinary.uploader.upload(image, {
          folder: "educonnect_posts",
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          msg: "Failed to upload image",
        });
      }
    }

    // Create post
    const post = new Post({
      user: req.user.id,
      description,
      link,
      imageUrl,
    });

    await post.save();

    // Populate user info
    await post.populate("user", "name email");

    res.json({
      success: true,
      msg: "Post created successfully",
      post: {
        ...post.toObject(),
        isLiked: false,
        likes: 0,
      },
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Check if current user liked each post
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const isLiked = await Like.exists({
          user: req.user.id,
          post: post._id,
        });
        return {
          ...post.toObject(),
          isLiked: !!isLiked,
          likes: await Like.countDocuments({ post: post._id }),
        };
      })
    );

    res.json({ success: true, posts: postsWithLikes });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Like/Unlike a post
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if already liked
    const existingLike = await Like.findOne({
      user: req.user.id,
      post: postId,
    });

    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
      const likes = await Like.countDocuments({ post: postId });
      res.json({ success: true, likes, isLiked: false });
    } else {
      // Like
      const like = new Like({
        user: req.user.id,
        post: postId,
      });
      await like.save();
      const likes = await Like.countDocuments({ post: postId });
      res.json({ success: true, likes, isLiked: true });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
