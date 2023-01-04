import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// REGISTER
export const Register = async (req, res) => {
    try {
        const { userName, email, password, location, profession, gender, picturePath, about, graduateYear, phoneNo, facebookId, instagramId, linkedinId, githubId } = req.body;

        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(401).json("Email already exists.");
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            userName,
            email,
            password: passwordHash,
            location,
            profession,
            gender,
            picturePath,
            phoneNo,
            graduateYear,
            about,
            facebookId,
            instagramId,
            linkedinId,
            githubId
        });

        const saveUser = await newUser.save();
        res.status(201).json(saveUser);

    } catch (err) {
        res.status(200).json({ message: err.message });
    }
}


// LOGIN
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ message: "User does't exists." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.status(200).json({ token, user });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
















