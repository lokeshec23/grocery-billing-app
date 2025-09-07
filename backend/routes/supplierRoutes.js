// ```javascript:Supplier Routes:backend/routes/supplierRoutes.js
import express from "express";
const router = express.Router();
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(protect, adminOnly, getSuppliers)
  .post(protect, adminOnly, createSupplier);
router
  .route("/:id")
  .put(protect, adminOnly, updateSupplier)
  .delete(protect, adminOnly, deleteSupplier);

export default router;
