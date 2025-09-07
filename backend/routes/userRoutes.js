import express from "express";
const router = express.Router();
import {
  authUser,
  registerUserByAdmin,
  registerCustomer,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

router.route("/").post(protect, adminOnly, registerUserByAdmin);
router.post("/login", authUser);
router.post("/register-customer", registerCustomer);

export default router;
