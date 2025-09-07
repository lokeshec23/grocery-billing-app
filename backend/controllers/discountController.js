import asyncHandler from "express-async-handler";
import Discount from "../models/discountModel.js";

// @desc    Get all discounts
// @route   GET /api/discounts
// @access  Private/Admin
const getDiscounts = asyncHandler(async (req, res) => {
  const discounts = await Discount.find({});
  res.json(discounts);
});

// @desc    Create a new discount
// @route   POST /api/discounts
// @access  Private/Admin
const createDiscount = asyncHandler(async (req, res) => {
  const { code, type, value, expiresAt } = req.body;

  const discountExists = await Discount.findOne({ code });
  if (discountExists) {
    res.status(400);
    throw new Error("Discount code already exists");
  }

  const discount = new Discount({
    code,
    type,
    value,
    expiresAt,
  });

  const createdDiscount = await discount.save();
  res.status(201).json(createdDiscount);
});

// @desc    Delete a discount
// @route   DELETE /api/discounts/:id
// @access  Private/Admin
const deleteDiscount = asyncHandler(async (req, res) => {
  const discount = await Discount.findById(req.params.id);
  if (discount) {
    await discount.deleteOne();
    res.json({ message: "Discount removed" });
  } else {
    res.status(404);
    throw new Error("Discount not found");
  }
});

// @desc    Validate a discount code and return its value
// @route   GET /api/discounts/validate/:code
// @access  Private
const validateDiscount = asyncHandler(async (req, res) => {
  const discount = await Discount.findOne({ code: req.params.code });

  if (discount && discount.isActive && discount.expiresAt > new Date()) {
    res.json(discount);
  } else {
    res.status(404);
    throw new Error("Invalid or expired discount code");
  }
});

export { getDiscounts, createDiscount, deleteDiscount, validateDiscount };
