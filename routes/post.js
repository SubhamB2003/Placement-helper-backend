import express from "express";
import {
    createComment, removeComment,
    removePost, getFeedPosts, getUserPosts,
    AddRemoveLike, postUpdate, commentUpdate
} from "../controllers/post.js";

const router = express.Router();

// CREATE
router.post("/comment", createComment);

// READ
router.get("/", getFeedPosts);
router.get("/:userId/posts", getUserPosts);

// UPDATE
router.patch("/", postUpdate);
router.patch("/:id/likes", AddRemoveLike);
router.patch("/comment", commentUpdate);


// REMOVE
router.delete("/:postId/removepost", removePost);
router.delete("/comment", removeComment);


export default router;