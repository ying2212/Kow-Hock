import express from "express";
import { sendOtp, verifyOtp, getCurrentUser } from "../handler/AuthHandler.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
