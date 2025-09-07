import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    totalPrice,
    discountAmount,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      paymentMethod,
      itemsPrice,
      taxPrice,
      discountAmount,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Loop through order items and update product stock
    for (const item of createdOrder.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.qty;
        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get dashboard statistics
// @route   GET /api/orders/dashboard-stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments({});
  const totalRevenue = await Order.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$totalPrice" },
      },
    },
  ]);

  const topSellingProducts = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.name",
        totalSold: { $sum: "$orderItems.qty" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  const salesByDate = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    totalOrders,
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    topSellingProducts,
    salesByDate,
  });
});

// @desc    Get logged-in staff's sales history
// @route   GET /api/orders/my-sales
// @access  Private/Staff
const getMySales = asyncHandler(async (req, res) => {
  const sales = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(sales);
});

// @desc    Get a user's most frequently bought items
// @route   GET /api/orders/my-frequent-items
// @access  Private/Customer
const getFrequentItems = asyncHandler(async (req, res) => {
  const frequentItems = await Order.aggregate([
    { $match: { user: req.user._id } },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        name: { $first: "$orderItems.name" },
        totalBought: { $sum: "$orderItems.qty" },
      },
    },
    { $sort: { totalBought: -1 } },
    { $limit: 5 },
  ]);

  res.json(frequentItems);
});

export {
  addOrderItems,
  getOrders,
  getMyOrders,
  getDashboardStats,
  getMySales,
  getFrequentItems,
};
