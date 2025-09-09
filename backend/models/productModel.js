import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    barcode: {
      type: String,
      required: true,
      unique: true,
    },
    mrp: {
      type: Number,
      required: true,
      default: 0,
    },
    costPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    taxRate: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: true, // Image is now a required field
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLXraBg2V7bFkcJ_2dhzl8IQTODmPHC9bAlAk6sMf8xd6Z90wE-GrtM1Tp2f2l7yz6nto&usqp=CAU", // Default image URL
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
