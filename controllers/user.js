import User from "../models/User.js";
import bcrypt from "bcrypt";
import Post from "../models/Post.js";


// READ (PROFILE, USER FRIENDS)
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


// UPDATE
export const AddRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const userFriend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            userFriend.friends = userFriend.friends.filter((id) => id !== id);
        }
        else {
            user.friends.push(friendId);
            userFriend.friends.push(id);
        }

        await user.save();
        await userFriend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, userName, profession, picturePath }) => {
                return ({ _id, userName, profession, picturePath });
            });

        console.log(formattedFriends);

        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { userName, location, profession, gender, picturePath, about, phoneNo } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(400);


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

        const postUserUpdate = await Post.updateMany(
            {
                "comments.userId": userId
            },
            {
                $set: {
                    "comments.$.userPicturePath": picturePath
                }
            },
            { new: true }
        );
        console.log(postUserUpdate)
        res.status(200).json(updateUser);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
