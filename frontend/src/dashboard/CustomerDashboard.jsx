import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";

const CustomerDashboard = () => {
  const [frequentItems, setFrequentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useContext(UserContext);
  const { user } = state;

  useEffect(() => {
    const fetchFrequentItems = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await api.get("/orders/my-frequent-items", config);
        setFrequentItems(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch frequent items"
        );
        setLoading(false);
      }
    };
    if (user && user.role === "customer") {
      fetchFrequentItems();
    }
  }, [user]);

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Welcome to our store!</h1>
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="p-4 shadow-sm mb-4">
            <h4 className="mb-3">Your Frequently Bought Items</h4>
            {loading ? (
              <p>Loading recommendations...</p>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : frequentItems.length === 0 ? (
              <p>Start shopping to see your recommendations here!</p>
            ) : (
              <ul className="list-group list-group-flush">
                {frequentItems.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {item.name}
                    <span className="badge bg-primary rounded-pill">
                      {item.totalBought} units
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </Col>
      </Row>
      <div className="text-center mt-4">
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
    </Container>
  );
};

export default CustomerDashboard;
