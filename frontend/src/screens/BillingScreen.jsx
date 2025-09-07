import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Badge,
  Card,
} from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";

const BillingScreen = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState(null);

  const { state } = useContext(UserContext);
  const { user } = state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
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
    if (user) {
      fetchProducts();
    }
  }, [user, navigate]);

  const addToCartHandler = (product) => {
    const existingItem = cart.find((item) => item.product === product._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product === product._id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          product: product._id,
          name: product.name,
          barcode: product.barcode,
          qty: 1,
          mrp: product.mrp,
          taxRate: product.taxRate,
        },
      ]);
    }
  };

  const removeFromCartHandler = (productId) => {
    setCart(cart.filter((item) => item.product !== productId));
  };

  const updateQuantityHandler = (productId, qty) => {
    setCart(
      cart.map((item) =>
        item.product === productId ? { ...item, qty: parseInt(qty, 10) } : item
      )
    );
  };

  const getFilteredProducts = () => {
    if (searchTerm.length === 0) {
      return [];
    }
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
    );
  };

  const calculateTotals = () => {
    const itemsPrice = cart.reduce((acc, item) => acc + item.mrp * item.qty, 0);
    const taxPrice = cart.reduce(
      (acc, item) => acc + ((item.mrp * item.taxRate) / 100) * item.qty,
      0
    );
    const totalPrice = itemsPrice + taxPrice;
    return { itemsPrice, taxPrice, totalPrice };
  };

  const { itemsPrice, taxPrice, totalPrice } = calculateTotals();

  const checkoutHandler = async () => {
    if (cart.length === 0) {
      setCheckoutMessage({
        type: "danger",
        text: "Cart is empty. Please add products to checkout.",
      });
      return;
    }
    setCheckoutMessage(null);

    const orderItems = cart.map((item) => ({
      name: item.name,
      qty: item.qty,
      barcode: item.barcode,
      price: item.mrp,
      product: item.product,
    }));

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await api.post(
        "/orders",
        {
          orderItems,
          paymentMethod: "Cash", // Dummy value for now
          itemsPrice,
          taxPrice,
          totalPrice,
        },
        config
      );

      setCart([]);
      setCheckoutMessage({
        type: "success",
        text: "Order placed successfully!",
      });
    } catch (err) {
      setCheckoutMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to place order",
      });
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Point of Sale</h1>
      {checkoutMessage && (
        <div className={`alert alert-${checkoutMessage.type}`}>
          {checkoutMessage.text}
        </div>
      )}
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Row>
          <Col md={7}>
            <Card className="p-4 shadow-sm">
              <h4 className="mb-3">Product Search</h4>
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
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredProducts().map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>${product.mrp.toFixed(2)}</td>
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
                        <td>
                          <Button
                            variant="primary"
                            className="btn-sm"
                            onClick={() => addToCartHandler(product)}
                            disabled={product.stock === 0}
                          >
                            Add
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
              <h4 className="mb-3">Invoice</h4>
              {cart.length === 0 ? (
                <p>No items in cart.</p>
              ) : (
                <Table striped bordered hover responsive className="table-sm">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
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
                        <td>${(item.mrp * item.qty).toFixed(2)}</td>
                        <td>
                          <Button
                            variant="danger"
                            className="btn-sm"
                            onClick={() => removeFromCartHandler(item.product)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <p>Subtotal:</p>
                  <p>${itemsPrice.toFixed(2)}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Tax:</p>
                  <p>${taxPrice.toFixed(2)}</p>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                  <h5 className="fw-bold">Total:</h5>
                  <h5 className="fw-bold">${totalPrice.toFixed(2)}</h5>
                </div>
              </Card.Body>
              <Button
                variant="success"
                className="btn-block"
                onClick={checkoutHandler}
                disabled={cart.length === 0}
              >
                Checkout
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default BillingScreen;
