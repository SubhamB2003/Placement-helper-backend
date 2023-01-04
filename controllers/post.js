import fs from "fs";
import path from "path";

import Post from "../models/Post.js";
import User from "../models/User.js";


// CREATE
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);

        const newPost = await new Post({
            userId,
            userName: user.userName,
            description,
            picturePath,
            userPicturePath: user.picturePath,
            likes: {},
            comments: []
        });
        await newPost.save();

        const post = await Post.find().sort({ 'updatedAt': -1, 'createdAt': - 1 }).lean();

        res.status(200).json(post);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const createComment = async (req, res) => {
    try {
        const { userId, postId, comment, updatedAt } = req.body;
        const user = await User.findById(userId);
        let posts = await Post.findById(postId);

        posts.comments.push({
            userId: userId,
            userName: user.userName,
            userPicturePath: user.picturePath,
            comment: comment,
            updatedAt: updatedAt
        });
        await posts.save();
        res.status(200).json(posts);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


// READ
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find().sort({ 'updatedAt': -1, 'comments.updatedAt': -1 }).lean();
        res.status(200).json(post);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId }).sort({ 'updatedAt': -1, 'comments.updatedAt': -1 }).lean();

        res.status(200).json(post);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const sharePost = async (req, res) => {
    try {

        const { postId } = req.params;
        const post = await Post.findById(postId);
        res.status(200).json(post);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}



// UPDATE
export const AddRemoveLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: "User not found." });

        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const postUpdate = async (req, res) => {
    try {
        const { postId, desc } = req.body;
        const post = await Post.findById(postId);
        if (!post) return res.status(400);

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                description: desc
            },
            { new: true }
        );

        res.status(200).json(updatedPost);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const commentUpdate = async (req, res) => {
    try {
        const { userId, postId, cmtId, comment, updatedAt } = req.body;
        const user = await User.findById(userId);
        let post = await Post.findById(postId);

        await Post.updateOne(
            {
                "comments._id": cmtId
            },
            {
                "$set": {
                    "comments.$": {
                        userId: userId,
                        userPicturePath: user.picturePath,
                        userName: user.userName,
                        comment: comment,
                        updatedAt: updatedAt
                    },
                }
            },
            { "new": true }
        );
        post = await Post.findById(postId);

        res.status(200).json(post);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


// REMOVE
export const removePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const currPost = await Post.findById(postId);
        const pictureName = currPost.picturePath;

        if (!currPost) return res.status(400).json({ message: "Does't found any post." });

        await Post.findByIdAndDelete(postId);
        const post = await Post.find().sort({ 'updatedAt': -1, 'createdAt': - 1 }).lean();
        await User.updateMany(
            { "savePosts": postId },
            {
                $pull: {
                    "savePosts": postId
                }
            }
        )

        res.status(200).json(post);

        if (pictureName && fs.existsSync(path.resolve("F:/PERSONAL/Projects/PlacementHelper/server/public/assets/", pictureName))) {
            fs.unlinkSync(path.resolve("F:/PERSONAL/Projects/PlacementHelper/server/public/assets/", pictureName));
        }

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const removeComment = async (req, res) => {
    try {
        const { userId, postId, cmtId } = req.body;

        const user = await User.findById(userId);
        const post = await Post.findById(postId);

        if (!user && !post) return res.status(400).json({ message: "Invalid credentials." });

        const updatedUser = await Post.updateOne({
            "_id": postId
        }, {
            $pull: {
                "comments": { _id: cmtId }
            }
        },
            { new: true }
        );
        const updatedPost = await Post.findById(postId);
        if (updatedUser) return res.status(200).json(updatedPost);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}