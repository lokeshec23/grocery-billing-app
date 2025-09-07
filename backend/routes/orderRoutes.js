import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getOrders,
  getMyOrders,
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
router.route("/myorders").get(protect, getMyOrders); // Ensure this line is present

export default router;
