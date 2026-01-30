import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  createPost,
  getPosts,
  likePost,
} from "../controllers/postController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Use multer middleware for file upload
router.post("/create", protectRoute, upload.single("image"), createPost);
router.get("/", protectRoute, getPosts);
router.post("/:postId/like", protectRoute, likePost);

export default router;
