import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getComments, addComment } from "../controllers/commentController.js";

const router = express.Router();

router.get("/:postId/comments", protectRoute, getComments);
router.post("/:postId/comments", protectRoute, addComment);

export default router;
