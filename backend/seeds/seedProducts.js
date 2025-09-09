// seedProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/productModel.js"; // adjust path if different
// import connectDB from "../config/dbConnection.js";
import { products } from "../utils/productsList.js"; // Sample product data
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb://localhost:27017/grocery_billing"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany(); // Clears existing products
    await Product.insertMany(products);
    console.log("Products seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();
