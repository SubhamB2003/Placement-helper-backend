import express from "express";
import {
    getUser,
    getUserFriends,
    AddRemoveSavedPost
} from "../controllers/user.js";


const router = express.Router();

/* READ */
router.get("/:id", getUser);
router.get("/:id/friends", getUserFriends);

/* UPDATE */
router.patch("/:userId/:postId", AddRemoveSavedPost);

export default router;
