import express from "express";
const router = express.Router();
import {
  getDiscounts,
  createDiscount,
  deleteDiscount,
  validateDiscount,
} from "../controllers/discountController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(protect, adminOnly, getDiscounts)
  .post(protect, adminOnly, createDiscount);
router.route("/:id").delete(protect, adminOnly, deleteDiscount);
router.route("/validate/:code").get(protect, validateDiscount);

export default router;
