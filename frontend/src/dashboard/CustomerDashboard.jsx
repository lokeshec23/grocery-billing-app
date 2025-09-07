import React from "react";
import { Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CustomerDashboard = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card className="text-center p-5 shadow-sm">
        <h1 className="mb-4">Welcome to our store!</h1>
        <p className="lead">Browse our products or check your order history.</p>
        <div className="d-flex justify-content-center">
          <LinkContainer to="/catalog">
            <Button variant="primary" size="lg" className="me-2">
              Shop Now
            </Button>
          </LinkContainer>
          <LinkContainer to="/my-orders">
            <Button variant="secondary" size="lg">
              My Orders
            </Button>
          </LinkContainer>
        </div>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
