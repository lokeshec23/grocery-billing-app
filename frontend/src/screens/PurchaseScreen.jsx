import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Table,
  Container,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const PurchaseScreen = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { state } = useContext(UserContext);
  const { user } = state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }

    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data: suppliersData } = await api.get("/suppliers", config);
        const { data: productsData } = await api.get("/products", config);
        setSuppliers(suppliersData);
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };
    if (user && user.role === "admin") {
      fetchData();
    }
  }, [user, navigate]);

  const getFilteredProducts = () => {
    if (searchTerm.length === 0) {
      return products;
    }
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
    );
  };

  const addItemHandler = (product) => {
    const existingItem = purchaseItems.find(
      (item) => item.product === product._id
    );
    if (existingItem) {
      setPurchaseItems(
        purchaseItems.map((item) =>
          item.product === product._id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setPurchaseItems([
        ...purchaseItems,
        {
          product: product._id,
          name: product.name,
          costPrice: product.costPrice,
          qty: 1,
        },
      ]);
    }
  };

  const removeItemHandler = (productId) => {
    setPurchaseItems(
      purchaseItems.filter((item) => item.product !== productId)
    );
  };

  const updateQuantityHandler = (productId, qty) => {
    const newQty = parseInt(qty, 10);
    if (newQty <= 0) {
      removeItemHandler(productId);
    } else {
      setPurchaseItems(
        purchaseItems.map((item) =>
          item.product === productId ? { ...item, qty: newQty } : item
        )
      );
    }
  };

  const updateCostPriceHandler = (productId, price) => {
    const newPrice = parseFloat(price);
    setPurchaseItems(
      purchaseItems.map((item) =>
        item.product === productId ? { ...item, costPrice: newPrice } : item
      )
    );
  };

  const calculateTotalCost = () => {
    return purchaseItems
      .reduce((acc, item) => acc + item.costPrice * item.qty, 0)
      .toFixed(2);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!selectedSupplier || purchaseItems.length === 0) {
      setError("Please select a supplier and add items to the purchase list.");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await api.post(
        "/purchases",
        {
          supplier: selectedSupplier,
          purchaseItems,
          totalCost: calculateTotalCost(),
        },
        config
      );

      setPurchaseItems([]);
      setSelectedSupplier("");
      alert("Purchase recorded successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record purchase");
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Record Stock Purchase</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Row>
          <Col md={7}>
            <Card className="p-4 shadow-sm">
              <h4 className="mb-3">Select Products</h4>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by product name or barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <Table striped hover responsive className="table-sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>MRP</th>
                      <th>Stock</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredProducts().map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>₹{product.mrp.toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <Button
                            variant="primary"
                            className="btn-sm"
                            onClick={() => addItemHandler(product)}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
          <Col md={5}>
            <Card className="p-4 shadow-sm">
              <h4 className="mb-3">Purchase Details</h4>
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label>Supplier</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    required
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Table striped bordered hover responsive className="table-sm">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Cost</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseItems.map((item) => (
                      <tr key={item.product}>
                        <td>{item.name}</td>
                        <td>
                          <Form.Control
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              updateQuantityHandler(
                                item.product,
                                e.target.value
                              )
                            }
                            min="1"
                            style={{ width: "60px" }}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={item.costPrice}
                            onChange={(e) =>
                              updateCostPriceHandler(
                                item.product,
                                e.target.value
                              )
                            }
                            min="0"
                            style={{ width: "80px" }}
                          />
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            className="btn-sm"
                            onClick={() => removeItemHandler(item.product)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <h5 className="text-end">
                  Total Cost: ₹{calculateTotalCost()}
                </h5>
                <Button type="submit" variant="success" className="w-100">
                  Record Purchase
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PurchaseScreen;
