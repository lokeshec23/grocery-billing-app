import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, category, barcode, mrp, stock, taxRate, image } = req.body;

  const productExists = await Product.findOne({ $or: [{ name }, { barcode }] });

  if (productExists) {
    res.status(400);
    throw new Error("Product with the same name or barcode already exists");
  }

  const product = new Product({
    user: req.user._id, // Assumes we have auth middleware to get the user from the token
    name,
    category,
    barcode,
    mrp,
    stock,
    taxRate,
    image,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, barcode, mrp, stock, taxRate, image } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.category = category || product.category;
    product.barcode = barcode || product.barcode;
    product.mrp = mrp || product.mrp;
    product.stock = stock || product.stock;
    product.taxRate = taxRate || product.taxRate;
    product.image = image || product.image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
