import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
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
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useContext(UserContext);
  const { user } = state;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await api.get("/orders/dashboard-stats", config);
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch dashboard stats"
        );
        setLoading(false);
      }
    };
    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // Prepare data for charts
  const salesByDateData = {
    labels: stats.salesByDate.map((item) => item._id),
    datasets: [
      {
        label: "Sales ($)",
        data: stats.salesByDate.map((item) => item.totalSales),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const topProductsData = {
    labels: stats.topSellingProducts.map((item) => item._id),
    datasets: [
      {
        label: "Units Sold",
        data: stats.topSellingProducts.map((item) => item.totalSold),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Admin Dashboard</h1>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="text-center p-4 h-100">
            <h3>Total Revenue</h3>
            <p className="display-4 fw-bold text-success">
              ${stats.totalRevenue.toFixed(2)}
            </p>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="text-center p-4 h-100">
            <h3>Total Orders</h3>
            <p className="display-4 fw-bold text-primary">
              {stats.totalOrders}
            </p>
          </Card>
        </Col>
      </Row>
      <Row className="mb-5">
        <Col md={12}>
          <Card className="p-4 shadow-sm">
            <h4 className="mb-4">Sales Over Time</h4>
            <Bar
              data={salesByDateData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mb-4">
          <Card className="p-4 shadow-sm">
            <h4 className="mb-4">Top 5 Selling Products</h4>
            <Doughnut
              data={topProductsData}
              options={{
                responsive: true,
                plugins: { legend: { position: "right" } },
              }}
            />
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h4 className="mb-4">Top 5 Selling Products (List)</h4>
            <ol>
              {stats.topSellingProducts.map((item) => (
                <li key={item._id} className="mb-2">
                  {item._id} - **{item.totalSold}** units sold
                </li>
              ))}
            </ol>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
