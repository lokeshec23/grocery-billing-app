import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Row, Col, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { state } = useContext(UserContext);
  const { user } = state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }

    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await api.get("/orders", config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
        setLoading(false);
      }
    };
    if (user && user.role === "admin") {
      fetchOrders();
    }
  }, [user, navigate]);

  const calculateTotalSales = () => {
    const total = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    return total.toFixed(2);
  };

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Sales Report</h1>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <Card className="p-4 shadow-sm">
              <Row className="mb-3">
                <Col md={6}>
                  <p>
                    <strong>Total Orders:</strong> {orders.length}
                  </p>
                </Col>
                <Col md={6} className="text-end">
                  <p>
                    <strong>Total Revenue:</strong> ${calculateTotalSales()}
                  </p>
                </Col>
              </Row>
              <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                <Table striped bordered hover responsive className="table-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>DATE</th>
                      <th>TOTAL</th>
                      <th>PAYMENT METHOD</th>
                      <th>STAFF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id.substring(18)}</td>
                        <td>{order.createdAt.substring(0, 10)}</td>
                        <td>${order.totalPrice.toFixed(2)}</td>
                        <td>{order.paymentMethod}</td>
                        <td>{order.user.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderListScreen;
