import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.js";
import { createDriver, getDrivers } from "../controllers/DriverController.js";

const router = Router();

router.get("/", authMiddleWare, getDrivers);
router.post("/", authMiddleWare, createDriver);

export default router;
