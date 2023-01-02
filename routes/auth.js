import express from "express";
import { Login } from "../controllers/auth.js";

const router = express.Router();

// CREATE
router.post("/login", Login);

export default router;

