import { Router } from "express";
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus 
} from "../controllers/OrderController.js";
import { authMiddleWare as authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrderById);
router.post("/", authMiddleware, createOrder);
router.patch("/:id/status", authMiddleware, updateOrderStatus);

export default router;

