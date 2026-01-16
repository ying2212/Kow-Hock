import { Router } from "express";
import { createDriver, getDrivers } from "../handler/DriverHandler.js";

const router = Router();

router.get("/", getDrivers);
router.post("/", createDriver);

export default router;
