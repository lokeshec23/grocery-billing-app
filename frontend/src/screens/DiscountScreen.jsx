import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Card,
  Container,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const DiscountScreen = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    type: "percentage",
    value: 0,
    expiresAt: "",
  });

  const { state } = useContext(UserContext);
  const { user } = state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
    const fetchDiscounts = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await api.get("/discounts", config);
        setDiscounts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch discounts");
        setLoading(false);
      }
    };
    if (user && user.role === "admin") {
      fetchDiscounts();
    }
  }, [user, navigate]);

  const addDiscountHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await api.post("/discounts", newDiscount, config);
      setDiscounts([...discounts, data]);
      setNewDiscount({ code: "", type: "percentage", value: 0, expiresAt: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add discount");
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this discount code?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await api.delete(`/discounts/${id}`, config);
        setDiscounts(discounts.filter((discount) => discount._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete discount");
      }
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Discount Management</h1>
      <Card className="p-4 mb-4">
        <h4>Add New Discount</h4>
        <Form onSubmit={addDiscountHandler}>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Code"
                  value={newDiscount.code}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, code: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Select
                  value={newDiscount.type}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, type: e.target.value })
                  }
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  placeholder="Value"
                  value={newDiscount.value}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, value: e.target.value })
                  }
                  required
                  min="0"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="date"
                  value={newDiscount.expiresAt}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      expiresAt: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" variant="primary">
            <FontAwesomeIcon icon={faPlus} /> Add Discount
          </Button>
        </Form>
      </Card>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Expires</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount._id}>
                <td>{discount.code}</td>
                <td>{discount.type}</td>
                <td>
                  {discount.type === "percentage"
                    ? `${discount.value}%`
                    : `$${discount.value.toFixed(2)}`}
                </td>
                <td>{new Date(discount.expiresAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(discount._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default DiscountScreen;
