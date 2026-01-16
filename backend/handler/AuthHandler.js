import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";
import { sendWhatsApp } from "../middleware/whatsapp.js";

// Send OTP
export async function sendOtp(req, res) {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    await prisma.otpCode.deleteMany({ where: { phone } });
    await prisma.otpCode.create({ data: { phone, code, expiresAt } });
    
    // Only send WhatsApp if Twilio is configured
    try {
      await sendWhatsApp(phone, code);
    } catch (twilioError) {
      console.log("WhatsApp sending failed, OTP code:", code);
    }

    res.json({ message: "OTP sent", devCode: process.env.NODE_ENV === 'development' ? code : undefined });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}

// Verify OTP
export async function verifyOtp(req, res) {
  const { phone, code, name } = req.body;

  try {
    const record = await prisma.otpCode.findFirst({
      where: { phone, code },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: { phone, name: name || "New User" },
      });
    }

    await prisma.otpCode.deleteMany({ where: { phone } });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        phone: user.phone, 
        role: user.role 
      },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login success",
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        phone: user.phone, 
        role: user.role 
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
}

// Get current user
export async function getCurrentUser(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to get user" });
  }
}

