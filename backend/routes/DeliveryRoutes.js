import { Router } from "express";
import { 
  getDeliveries, 
  createDelivery, 
  updateDeliveryStatus 
} from "../controllers/DeliveryController.js";
import { authMiddleWare } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleWare, getDeliveries);
router.post("/", authMiddleWare, createDelivery);
router.patch("/:id/status", authMiddleWare, updateDeliveryStatus);

export default router;
