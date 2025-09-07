import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Table, Container, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";

const StaffDashboard = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useContext(UserContext);
  const { user } = state;

  useEffect(() => {
    const fetchMySales = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await api.get("/orders/my-sales", config);
        setSales(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch sales history"
        );
        setLoading(false);
      }
    };
    if (user && user.role === "staff") {
      fetchMySales();
    }
  }, [user]);

  return (
    <Container className="my-5">
      <Row className="align-items-center mb-4">
        <Col>
          <h1>My Sales History</h1>
        </Col>
        <Col className="text-end">
          <LinkContainer to="/billing">
            <Button variant="primary">Go to Billing</Button>
          </LinkContainer>
        </Col>
      </Row>
      {loading ? (
        <p>Loading sales history...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Card className="p-4 shadow-sm">
          {sales.length === 0 ? (
            <p>You have not recorded any sales yet.</p>
          ) : (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>ITEMS</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id}>
                    <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                    <td>${sale.totalPrice.toFixed(2)}</td>
                    <td>{sale.orderItems.length} items</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      )}
    </Container>
  );
};

export default StaffDashboard;
