// File: frontend/src/screens/PaymentScreen.jsx

import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Alert,
  Form,
  Modal,
} from "react-bootstrap";
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

  // State for address fields
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // State for payment method selection
  const [paymentMethod, setPaymentMethod] = useState("");

  // State for modal (popup)
  const [showModal, setShowModal] = useState(false);

  // State for dummy payment details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (locationState?.order) {
      setOrder(locationState.order);
    } else {
      setError("No order found. Please go back and create an order.");
    }
  }, [user, navigate, locationState]);

  const openPaymentModal = () => {
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
    if (paymentMethod === "Cash on Delivery") {
      handleFinalPayment();
    } else {
      setError(null);
      setShowModal(true);
    }
  };

  const handleFinalPayment = async () => {
    setLoading(true);
    setError(null);
    setShowModal(false); // Close modal if it's open

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await api.put(
        `/orders/${order._id}/pay`,
        { paymentMethod, address, city, postalCode },
        config
      );

      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate("/my-orders"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
      setLoading(false);
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    // Simulate payment details validation
    if (paymentMethod.includes("Card")) {
      const { cardNumber, cardName, expiryDate, cvv } = cardDetails;
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        setError("Please fill all card details.");
        return;
      }
    } else if (paymentMethod.includes("UPI")) {
      if (!upiId) {
        setError("Please enter a valid UPI ID.");
        return;
      }
    }

    handleFinalPayment();
  };

  const renderPaymentDetailsForm = () => {
    if (paymentMethod.includes("Card")) {
      return (
        <Form onSubmit={handleModalSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Card Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="0000 0000 0000 0000"
              required
              value={cardDetails.cardNumber}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, cardNumber: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cardholder Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="John Doe"
              required
              value={cardDetails.cardName}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, cardName: e.target.value })
              }
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="MM/YY"
                  required
                  value={cardDetails.expiryDate}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      expiryDate: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="***"
                  required
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="success" type="submit" className="w-100">
            Confirm Payment
          </Button>
        </Form>
      );
    } else if (paymentMethod.includes("UPI")) {
      return (
        <Form onSubmit={handleModalSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>UPI ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="yourname@upi"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" type="submit" className="w-100">
            Confirm Payment
          </Button>
        </Form>
      );
    }
    return null;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h1 className="text-center mb-4">Payment & Order Summary</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">
              Payment successful! Redirecting to your orders...
            </Alert>
          )}

          {order && (
            <Card className="p-4 shadow-sm">
              <Row>
                <Col md={6}>
                  <Card.Title className="mb-3">Order Details</Card.Title>
                  <p>
                    <strong>Order ID:</strong> {order._id.substring(18)}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹
                    {order.totalPrice.toFixed(2)}
                  </p>
                </Col>

                <Col md={6}>
                  <Card.Title className="mb-3">Delivery Address</Card.Title>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Street Address, Appartment"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Postal Code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Form>

                  <hr />

                  <Card.Title className="mb-3">Payment Method</Card.Title>
                  <div className="d-flex flex-column gap-2">
                    <Form.Check
                      type="radio"
                      id="cod"
                      label="Cash on Delivery"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      id="debitCard"
                      label="Debit Card"
                      name="paymentMethod"
                      value="Debit Card"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      id="creditCard"
                      label="Credit Card"
                      name="paymentMethod"
                      value="Credit Card"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <hr />
                    <Card.Text className="text-muted mb-1">
                      Pay via UPI
                    </Card.Text>
                    <Form.Check
                      type="radio"
                      id="gpay"
                      label="Google Pay"
                      name="paymentMethod"
                      value="UPI (Google Pay)"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      id="phonepe"
                      label="PhonePe"
                      name="paymentMethod"
                      value="UPI (PhonePe)"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      id="paytm"
                      label="Paytm"
                      name="paymentMethod"
                      value="UPI (Paytm)"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>

              <Button
                variant="success"
                onClick={openPaymentModal}
                disabled={loading || success || !paymentMethod}
                className="w-100 mt-4"
              >
                {paymentMethod === "Cash on Delivery"
                  ? "Place Order"
                  : `Pay ₹${order.totalPrice.toFixed(2)} Now`}
              </Button>
            </Card>
          )}
        </Col>
      </Row>

      {/* Payment Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter {paymentMethod} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {renderPaymentDetailsForm()}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PaymentScreen;
