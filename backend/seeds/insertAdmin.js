import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://lokeshec23_db_user:qC0H88evgYpeFxb2@cluster0.ece5kvs.mongodb.net/grocery_billing"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importAdminUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash("Test@123", 10);

    const adminUser = {
      name: "Lokesh",
      email: "lokesh.ec23@gmail.com",
      password: hashedPassword,
      role: "admin",
    };

    await User.create(adminUser);

    console.log("✅ Admin user added successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error adding admin user:", error.message);
    process.exit(1);
  }
};

// Ensure DB is connected first, then run
const start = async () => {
  await connectDB();
  await importAdminUser();
};

start();
