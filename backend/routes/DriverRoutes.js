import { Router } from "express";
import { authMiddleWare as authMiddleware } from "../middleware/auth.js";
import { createDriver, getDrivers } from "../controllers/DriverController.js";

const router = Router();

router.get("/", authMiddleware, getDrivers);
router.post("/", authMiddleware, createDriver);

export default router;
