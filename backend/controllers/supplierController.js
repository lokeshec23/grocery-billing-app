import asyncHandler from "express-async-handler";
import Supplier from "../models/supplierModel.js";

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private/Admin
const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find({});
  res.json(suppliers);
});

// @desc    Create a new supplier
// @route   POST /api/suppliers
// @access  Private/Admin
const createSupplier = asyncHandler(async (req, res) => {
  const { name, contactPerson, phone, email, address } = req.body;

  const supplier = new Supplier({
    name,
    contactPerson,
    phone,
    email,
    address,
  });

  const createdSupplier = await supplier.save();
  res.status(201).json(createdSupplier);
});

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
const updateSupplier = asyncHandler(async (req, res) => {
  const { name, contactPerson, phone, email, address } = req.body;
  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    supplier.name = name || supplier.name;
    supplier.contactPerson = contactPerson || supplier.contactPerson;
    supplier.phone = phone || supplier.phone;
    supplier.email = email || supplier.email;
    supplier.address = address || supplier.address;

    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } else {
    res.status(404);
    throw new Error("Supplier not found");
  }
});

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    await supplier.deleteOne();
    res.json({ message: "Supplier removed" });
  } else {
    res.status(404);
    throw new Error("Supplier not found");
  }
});

export { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
