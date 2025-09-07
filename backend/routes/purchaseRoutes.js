// ```javascript:Purchase Routes:backend/routes/purchaseRoutes.js
import express from "express";
const router = express.Router();
import { addPurchase } from "../controllers/purchaseController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

router.route("/").post(protect, adminOnly, addPurchase);

export default router;
