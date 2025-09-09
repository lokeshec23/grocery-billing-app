// File: frontend/src/screens/PaymentScreen.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";
import api from "../utils/api";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";

const PaymentScreen = () => {
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { state: userState } = useContext(UserContext);
  const { user } = userState;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (locationState?.order) {
      setOrder(locationState.order);
    } else {
      setError("No order found. Please go back and create an order.");
    }
  }, [user, navigate, locationState]);

  const handleDummyPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await api.put(`/orders/${order._id}/pay`, {}, config);
      setSuccess(true);
      setLoading(false);
      // Redirect after a short delay
      setTimeout(() => navigate("/home"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h1 className="text-center mb-4">Payment</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">
              Payment successful! Redirecting to home...
            </Alert>
          )}

          {order && (
            <Card className="p-4 shadow-sm">
              <Card.Title>Order Summary</Card.Title>
              <Card.Body>
                <p>
                  <strong>Order ID:</strong> {order._id.substring(18)}
                </p>
                <p>
                  <strong>Total Amount:</strong> ₹{order.totalPrice.toFixed(2)}
                </p>
                <Button
                  variant="success"
                  onClick={handleDummyPayment}
                  disabled={loading || success}
                  className="w-100"
                >
                  Pay Now
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentScreen;
