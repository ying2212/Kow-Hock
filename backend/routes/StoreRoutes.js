import express from "express";
import {
  createStore,
  getAllStores,
  getStoreById,
  updateStore
} from "../controllers/StoreController.js";

const router = express.Router();

router.post("/", createStore);
router.get("/", getAllStores);
router.get("/:id", getStoreById);
router.put("/:id", updateStore);
export default router;