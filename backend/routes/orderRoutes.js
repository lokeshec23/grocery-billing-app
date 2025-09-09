// File: backend/routes/orderRoutes.js

import express from "express";
const router = express.Router();
import {
  addOrderItems,
  updateOrderToPaid, // Import the new function
  getOrders,
  getMyOrders,
  getDashboardStats,
  getMySales,
  getFrequentItems,
} from "../controllers/orderController.js";
import {
  protect,
  staffOrCustomer,
  adminOnly,
  staffOnly,
} from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, staffOrCustomer, addOrderItems)
  .get(protect, adminOnly, getOrders);

router.route("/myorders").get(protect, staffOrCustomer, getMyOrders);
router.route("/dashboard-stats").get(protect, adminOnly, getDashboardStats);
router.route("/my-sales").get(protect, staffOnly, getMySales);
router
  .route("/my-frequent-items")
  .get(protect, staffOrCustomer, getFrequentItems);

// New payment route
router.route("/:id/pay").put(protect, updateOrderToPaid);

export default router;
