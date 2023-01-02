import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userPicturePath: {
        type: String,
    },
    userName: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    updatedAt: Date
});

const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    picturePath: String,
    userPicturePath: String,
    likes: {
        type: Map,
        of: Boolean
    },
    comments: [commentSchema],
}, { timestamps: true });





const Post = mongoose.model("Posts", postSchema);
export default Post;










