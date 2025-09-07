import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Table, Container, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  const aggregateDailySales = () => {
    const salesByDate = {};
    sales.forEach((sale) => {
      const date = new Date(sale.createdAt).toLocaleDateString();
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += sale.totalPrice;
    });
    return salesByDate;
  };

  const salesData = aggregateDailySales();
  const chartData = {
    labels: Object.keys(salesData),
    datasets: [
      {
        label: "Daily Sales",
        data: Object.values(salesData),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Your Daily Sales" },
    },
  };

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
        <Row>
          <Col md={12} className="mb-4">
            {sales.length > 0 ? (
              <Card className="p-4 shadow-sm">
                <Bar options={chartOptions} data={chartData} />
              </Card>
            ) : (
              <p className="text-center">
                You have not recorded any sales yet.
              </p>
            )}
          </Col>
          <Col md={12}>
            {sales.length > 0 && (
              <Card className="p-4 shadow-sm">
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
              </Card>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default StaffDashboard;
