import { Router } from "express";
import { 
  getDeliveries, 
  createDelivery, 
  updateDeliveryStatus 
} from "../controllers/DeliveryController.js";
import { authMiddleWare as authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, getDeliveries);
router.post("/", authMiddleware, createDelivery);
router.patch("/:id/status", authMiddleware, updateDeliveryStatus);

export default router;
