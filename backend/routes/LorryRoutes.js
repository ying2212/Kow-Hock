import { Router } from "express";
import { createLorry, getLorrys } from "../controllers/LorryController.js";

const router = Router();

router.get("/", getLorrys);
router.post("/", createLorry);

export default router;