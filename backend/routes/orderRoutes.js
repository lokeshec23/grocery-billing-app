import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getOrders,
  getMyOrders,
  getDashboardStats,
} from "../controllers/orderController.js";
import {
  protect,
  staffOrCustomer,
  adminOnly,
} from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, staffOrCustomer, addOrderItems)
  .get(protect, adminOnly, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/dashboard-stats").get(protect, adminOnly, getDashboardStats);

export default router;
