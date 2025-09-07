import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

dotenv.config(); // This must be at the very top to load variables

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

connectDB();

const importAdminUser = async () => {
  try {
    const adminUser = {
      name: "Admin User",
      email: "admin@admin.com",
      password: "123",
      role: "admin",
    };

    // Create the user in the database
    await User.create({
      ...adminUser,
    });

    console.log("Admin user added successfully!");
    process.exit();
  } catch (error) {
    console.error("Error adding admin user:", error.message);
    process.exit(1);
  }
};

importAdminUser();
