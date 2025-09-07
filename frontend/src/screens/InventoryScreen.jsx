import React, { useState, useEffect, useContext } from "react";
import { Table, Badge, Row, Col, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";

const InventoryScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { state } = useContext(UserContext);
  const { user } = state;
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is not an admin
    if (!user || user.role !== "admin") {
      navigate("/login");
    }

    const fetchProducts = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await api.get("/products", config);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
        setLoading(false);
      }
    };
    if (user && user.role === "admin") {
      fetchProducts();
    }
  }, [user, navigate]);

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Inventory Report</h1>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <Card className="p-4 shadow-sm">
              <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                <Table striped bordered hover responsive className="table-sm">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>CATEGORY</th>
                      <th>BARCODE</th>
                      <th>MRP</th>
                      <th>STOCK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{product.barcode}</td>
                        <td>₹ {product.mrp.toFixed(2)}</td>
                        <td>
                          {product.stock <= 10 && product.stock > 0 && (
                            <Badge bg="warning">
                              Low Stock ({product.stock})
                            </Badge>
                          )}
                          {product.stock > 10 && (
                            <Badge bg="success">
                              In Stock ({product.stock})
                            </Badge>
                          )}
                          {product.stock === 0 && (
                            <Badge bg="danger">Out of Stock</Badge>
                          )}
                        </td>
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

export default InventoryScreen;
