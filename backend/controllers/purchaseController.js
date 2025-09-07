// ```javascript:Purchase Controller:backend/controllers/purchaseController.js
import asyncHandler from "express-async-handler";
import Purchase from "../models/purchaseModel.js";
import Product from "../models/productModel.js";

// @desc    Create a new stock purchase
// @route   POST /api/purchases
// @access  Private/Admin
const addPurchase = asyncHandler(async (req, res) => {
  const { supplier, purchaseItems, totalCost } = req.body;

  if (purchaseItems && purchaseItems.length === 0) {
    res.status(400);
    throw new Error("No purchase items");
  } else {
    const purchase = new Purchase({
      user: req.user._id,
      supplier,
      purchaseItems,
      totalCost,
    });

    const createdPurchase = await purchase.save();

    // Loop through purchase items and update product stock
    for (const item of createdPurchase.purchaseItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.qty;
        product.costPrice = item.costPrice; // Update cost price to the new purchase price
        await product.save();
      }
    }

    res.status(201).json(createdPurchase);
  }
});

export { addPurchase };
