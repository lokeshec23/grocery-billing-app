import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";
import { UserContext } from "../context/UserContext";

const ProductFormScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useContext(UserContext);
  const { user } = state;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [barcode, setBarcode] = useState("");
  const [mrp, setMrp] = useState(0);
  const [stock, setStock] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    } else if (isEditMode) {
      fetchProductData();
    }
  }, [user, isEditMode, navigate, id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setName(data.name);
      setCategory(data.category);
      setBarcode(data.barcode);
      setMrp(data.mrp);
      setStock(data.stock);
      setTaxRate(data.taxRate);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch product data");
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    debugger;
    e.preventDefault();
    setError(null);
    setLoading(true);

    const productData = { name, category, barcode, mrp, stock, taxRate };
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      if (isEditMode) {
        await api.put(`/products/${id}`, productData, config);
      } else {
        await api.post("/products", productData, config);
      }
      setLoading(false);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Col md={8}>
        <h1>{isEditMode ? "Edit Product" : "Create Product"}</h1>
        {loading && <div>Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="barcode">
            <Form.Label>Barcode</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="mrp">
            <Form.Label>MRP ($)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="stock">
            <Form.Label>Stock Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="taxRate">
            <Form.Label>Tax Rate (%)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter tax rate"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            {isEditMode ? "Update Product" : "Create Product"}
          </Button>
        </Form>
      </Col>
    </div>
  );
};

export default ProductFormScreen;
