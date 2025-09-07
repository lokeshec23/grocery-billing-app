import express from "express";
const router = express.Router();
import { addOrderItems, getOrders } from "../controllers/orderController.js";
import {
  protect,
  staffOrCustomer,
  adminOnly,
} from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, staffOrCustomer, addOrderItems)
  .get(protect, adminOnly, getOrders);

export default router;
