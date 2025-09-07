import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { UserContext } from "../context/UserContext";

const ProductEditScreen = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [barcode, setBarcode] = useState("");
  const [mrp, setMrp] = useState(0);
  const [stock, setStock] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useContext(UserContext);
  const { user } = state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    } else {
      const fetchProduct = async () => {
        try {
          const { data } = await api.get(`/products/${id}`);
          setName(data.name);
          setCategory(data.category);
          setBarcode(data.barcode);
          setMrp(data.mrp);
          setStock(data.stock);
          setTaxRate(data.taxRate);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch product");
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, user, navigate]);

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

      await api.put(
        `/products/${id}`,
        { name, category, barcode, mrp, stock, taxRate },
        config
      );

      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Col md={8}>
        <h1>Edit Product</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="barcode" className="mb-3">
              <Form.Label>Barcode</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="mrp" className="mb-3">
              <Form.Label>MRP ($)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="stock" className="mb-3">
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="taxRate" className="mb-3">
              <Form.Label>Tax Rate (%)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter tax rate"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update Product
            </Button>
          </Form>
        )}
      </Col>
    </div>
  );
};

export default ProductEditScreen;
