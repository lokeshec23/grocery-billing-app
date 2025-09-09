import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
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
        // Add config with Authorization header
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
    // Fetch product only if a user is logged in
    if (user) {
      fetchProduct();
    } else {
      // Handle case where no user is logged in, e.g., redirect or show message
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
        Go Back
      </Button>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image
              src={
                product.image ||
                "https://via.placeholder.com/600x400?text=No+Image"
              }
              alt={product.name}
              fluid
            />
          </Col>
          <Col md={6}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Category:</Col>
                    <Col>{product.category}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Barcode:</Col>
                    <Col>{product.barcode}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>MRP:</Col>
                    <Col>₹{product.mrp.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Stock:</Col>
                    <Col>₹{product.stock}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax Rate:</Col>
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
