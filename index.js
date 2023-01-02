import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import dotenv, { config } from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { Register } from "./controllers/auth.js";
import { updateUser } from "./controllers/user.js";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";


import DB from "./Database/DB.js";
import { createPost } from "./controllers/post.js";

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));


// FILE STORAGE
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });


// ROUTES WITH FILES 
app.post("/auth/register", upload.single("picture"), Register);
app.patch("/user/:userId", upload.single("picture"), updateUser);
app.post("/posts", upload.single("picture"), createPost);


// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


// DATABASE CONNECTION
DB();


// APP RUN
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server listening port http://localhost:${process.env.PORT || 5000}`);
})













