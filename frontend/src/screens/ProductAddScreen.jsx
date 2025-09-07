import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { UserContext } from "../context/UserContext";

const ProductAddScreen = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [barcode, setBarcode] = useState("");
  const [mrp, setMrp] = useState(0);
  const [stock, setStock] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [error, setError] = useState(null);
  const { state } = useContext(UserContext);
  const { user } = state;
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not an admin
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await api.post(
        "/products",
        { name, category, barcode, mrp, stock, taxRate },
        config
      );

      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Col md={8}>
        <h1>Add Product</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="category" className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="barcode" className="mb-3">
            <Form.Label>Barcode</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="mrp" className="mb-3">
            <Form.Label>MRP ($)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="stock" className="mb-3">
            <Form.Label>Stock Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="taxRate" className="mb-3">
            <Form.Label>Tax Rate (%)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter tax rate"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Add Product
          </Button>
        </Form>
      </Col>
    </div>
  );
};

export default ProductAddScreen;
