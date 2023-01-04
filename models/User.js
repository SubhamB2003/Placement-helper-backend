import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 5
    },
    phoneNo: {
        type: Number,
        min: 9
    },
    picturePath: {
        type: String,
        default: null
    },
    location: {
        type: String,
        required: true,
    },
    profession: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    graduateYear: {
        type: String,
        required: true,
    },
    about: String,
    facebookId: String,
    instagramId: String,
    linkedinId: String,
    githubId: String,
    savePosts: {
        type: Array,
        default: []
    }
}, { timestamps: true });


const User = mongoose.model("Users", userSchema);
export default User;