import { PrismaClient } from "@prisma/client";
import { sendWhatsApp } from "../middleware/whatsapp.js";

const prisma = new PrismaClient();

// Send OTP
export async function sendOtp(req, res) {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    await prisma.otpCode.deleteMany({ where: { phone } });
    await prisma.otpCode.create({ data: { phone, code, expiresAt } });
    await sendWhatsApp(phone, code);

    res.json({ message: "OTP sent" });
  } catch (e) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
}

// Verify OTP
export async function verifyOtp(req, res) {
  const { phone, code, name } = req.body;

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

  res.json({
    message: "Login success",
    user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
  });
}
