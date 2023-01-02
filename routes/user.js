import express from "express";
import {
    getUser,
    getUserFriends,
    AddRemoveFriend
} from "../controllers/user.js";


const router = express.Router();

/* READ */
router.get("/:id", getUser);
router.get("/:id/friends", getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", AddRemoveFriend);

export default router;
