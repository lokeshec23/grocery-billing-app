import React, { useState, useEffect, useContext } from "react";
import { Table, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { state } = useContext(UserContext);
  const { user } = state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "customer") {
      navigate("/login");
    }

    const fetchMyOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await api.get("/orders/myorders", config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
        setLoading(false);
      }
    };

    if (user && user.role === "customer" && user.token) {
      fetchMyOrders();
    }
  }, [user, navigate]);

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">My Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Card className="p-4 shadow-sm">
          {orders.length === 0 ? (
            <p>You have not placed any orders yet.</p>
          ) : (
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id.substring(18)}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>${order.totalPrice.toFixed(2)}</td>
                      <td>{order.isPaid ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      )}
    </Container>
  );
};

export default MyOrdersScreen;
