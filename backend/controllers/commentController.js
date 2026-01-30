import Comment from "../models/Comment.js";

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const comment = new Comment({
      user: req.user.id,
      post: postId,
      content,
    });

    await comment.save();
    await comment.populate("user", "name email");

    res.json({
      success: true,
      msg: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
