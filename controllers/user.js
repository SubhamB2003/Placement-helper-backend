import fs from "fs";
import path from "path";

import User from "../models/User.js";
import Post from "../models/Post.js";


// READ (PROFILE, SEARCH BAR)
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        res.status(200).json(user);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(({ _id, userName, occupation, picturePath }) => {
            return ({ _id, userName, occupation, picturePath });
        });

        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const getAllUser = async (req, res) => {
    try {
        const user = await User.find();

        const formattedSavePosts = user.map(
            ({ _id, userName, profession, picturePath }) => {
                return { _id, userName, profession, picturePath };
            }
        );
        res.status(200).json(formattedSavePosts);

    } catch (err) {
        res.status(400).json({ "message": err.message });
    }
}



// UPDATE
export const AddRemoveSavedPost = async (req, res) => {
    try {
        const { userId, postId } = req.params;
        const user = await User.findById(userId);
        const post = await User.findById(postId);


        if (user.savePosts.includes(postId)) {
            user.savePosts = user.savePosts.filter((id) => id !== postId);
        }
        else {
            user.savePosts.push(postId);
        }

        const savePost = await user.save();
        res.status(200).json(savePost);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { userName, location, profession, gender, picturePath, about, graduateYear, phoneNo, facebookId, instagramId, linkedinId, githubId } = req.body;

        const user = await User.findById(userId);
        const pictureName = user.picturePath;

        if (!user) return res.status(400);

        if (pictureName !== picturePath && fs.existsSync(path.resolve("F:/PERSONAL/Projects/PlacementHelper/server/public/assets/", pictureName))) {
            fs.unlinkSync(path.resolve("F:/PERSONAL/Projects/PlacementHelper/server/public/assets/", pictureName));
        }

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                userName: userName,
                phoneNo: phoneNo,
                picturePath: picturePath,
                location: location,
                profession: profession,
                gender: gender,
                about: about,
                graduateYear: graduateYear,
                facebookId: facebookId,
                instagramId: instagramId,
                linkedinId: linkedinId,
                githubId: githubId
            },
            { new: true }
        );
        await Post.updateMany(
            { "userId": userId },
            {
                userPicturePath: picturePath
            },
            { new: true }
        );
        await Post.updateMany(
            {
                comments: { $elemMatch: { userId: userId } }
            },
            {
                $set: {
                    "comments.$.userPicturePath": picturePath
                }
            },
            { new: true }
        );
        res.status(200).json(updateUser);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
