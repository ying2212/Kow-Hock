import { Router } from "express";
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus 
} from "../controllers/OrderController.js";
import { authMiddleWare } from "../middleware/auth.js";

const router = Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", authMiddleWare, createOrder);
router.patch("/:id/status", authMiddleWare, updateOrderStatus);

export default router;

