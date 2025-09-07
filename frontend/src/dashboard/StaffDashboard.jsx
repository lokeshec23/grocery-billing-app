import React from "react";
import { Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const StaffDashboard = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card className="text-center p-5 shadow-sm">
        <h1 className="mb-4">Welcome, Staff Member</h1>
        <p className="lead">Your primary tool is the billing system.</p>
        <LinkContainer to="/billing">
          <Button variant="primary" size="lg">
            Go to Billing
          </Button>
        </LinkContainer>
      </Card>
    </div>
  );
};

export default StaffDashboard;
