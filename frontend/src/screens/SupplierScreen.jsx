import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Card,
  Form,
  Container,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const SupplierScreen = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
  });

  const { state } = useContext(UserContext);
  const { user } = state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }

    const fetchSuppliers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await api.get("/suppliers", config);
        setSuppliers(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch suppliers");
        setLoading(false);
      }
    };
    if (user && user.role === "admin") {
      fetchSuppliers();
    }
  }, [user, navigate]);

  const addSupplierHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await api.post("/suppliers", newSupplier, config);
      setSuppliers([...suppliers, data]);
      setIsAdding(false);
      setNewSupplier({
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add supplier");
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await api.delete(`/suppliers/${id}`, config);
        setSuppliers(suppliers.filter((supplier) => supplier._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete supplier");
      }
    }
  };

  return (
    <Container className="my-5">
      <Row className="align-items-center">
        <Col>
          <h1>Suppliers</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={() => setIsAdding(!isAdding)}>
            <FontAwesomeIcon icon={faPlus} />{" "}
            {isAdding ? "Cancel" : "Add Supplier"}
          </Button>
        </Col>
      </Row>

      {isAdding && (
        <Card className="p-4 mb-4">
          <h4>New Supplier</h4>
          <Form onSubmit={addSupplierHandler}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                value={newSupplier.name}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Contact Person"
                value={newSupplier.contactPerson}
                onChange={(e) =>
                  setNewSupplier({
                    ...newSupplier,
                    contactPerson: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Phone"
                value={newSupplier.phone}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, phone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={newSupplier.email}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Address"
                value={newSupplier.address}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, address: e.target.value })
                }
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Add
            </Button>
          </Form>
        </Card>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id}>
                <td>{supplier.name}</td>
                <td>{supplier.contactPerson}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.email}</td>
                <td>{supplier.address}</td>
                <td>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(supplier._id)}
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

export default SupplierScreen;
