import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  createPost,
  getPosts,
  likePost,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/create", protectRoute, createPost);
router.get("/", protectRoute, getPosts);
router.post("/:postId/like", protectRoute, likePost);

export default router;
