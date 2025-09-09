import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Image, Card, Button, ListGroup } from "react-bootstrap";
import api from "../utils/api";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { UserContext } from "../context/UserContext";

const ProductDetailsScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useContext(UserContext);
  const { user } = state;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await api.get(`/products/${id}`, config);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };
    if (user) {
      fetchProduct();
    } else {
      setError("Please log in to view product details.");
      setLoading(false);
    }
  }, [id, user]);

  const goBackHandler = () => {
    navigate(-1);
  };

  return (
    <>
      <Button className="btn btn-light my-3" onClick={goBackHandler}>
        ← Back
      </Button>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {/* LEFT SIDE - Product Image + Buttons */}
          <Col md={5} className="d-flex flex-column align-items-center">
            <Card className="p-3 shadow-sm w-100 text-center sticky-top">
              <Image
                src={
                  product.image ||
                  "https://via.placeholder.com/400x400?text=No+Image"
                }
                alt={product.name}
                fluid
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
              <div className="d-grid gap-2 mt-3">
                <Button variant="warning" size="lg">
                  ADD TO CART
                </Button>
                <Button variant="success" size="lg">
                  BUY NOW
                </Button>
              </div>
            </Card>
          </Col>

          {/* RIGHT SIDE - Product Details */}
          <Col md={7}>
            <Card className="p-4 shadow-sm">
              {/* Product Title */}
              <h3 className="mb-2">{product.name}</h3>

              {/* Rating placeholder */}
              <div className="d-flex align-items-center mb-3">
                <span className="badge bg-success me-2">4.3 ★</span>
                <small className="text-muted">
                  (2,345 ratings & 345 reviews)
                </small>
              </div>

              {/* Price section */}
              <h2 className="text-danger mb-3">₹{product.mrp.toFixed(2)}</h2>

              {/* Offers placeholder */}
              <div className="mb-3">
                <h6>Available offers</h6>
                <ul className="list-unstyled">
                  <li>✔ Bank Offer: 10% off on selected cards</li>
                  <li>✔ Special Price: Get extra 5% off (T&C)</li>
                  <li>✔ Free Delivery on your first order</li>
                </ul>
              </div>

              {/* Specs */}
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col className="fw-bold">Category:</Col>
                    <Col>{product.category}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col className="fw-bold">Barcode:</Col>
                    <Col>{product.barcode}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col className="fw-bold">Stock:</Col>
                    <Col>{product.stock} units</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col className="fw-bold">Tax Rate:</Col>
                    <Col>{product.taxRate}%</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductDetailsScreen;
