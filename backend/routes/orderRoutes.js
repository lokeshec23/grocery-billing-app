import express from "express";
const router = express.Router();
import { addOrderItems } from "../controllers/orderController.js";
import { protect, staffOrCustomer } from "../middleware/authMiddleware.js";

// This route is for both staff and customers to place an order
router.route("/").post(protect, staffOrCustomer, addOrderItems);

export default router;
