import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  InputGroup,
} from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const ProductCatalogScreen = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const { state } = useContext(UserContext);
  const { user } = state;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const config = {
          headers: {
            Authorization: user ? `Bearer ${user.token}` : "",
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
    fetchProducts();
  }, [user]);

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

  const calculateTotals = () => {
    const itemsPrice = cart.reduce((acc, item) => acc + item.mrp * item.qty, 0);
    const taxPrice = cart.reduce(
      (acc, item) => acc + ((item.mrp * item.taxRate) / 100) * item.qty,
      0
    );
    const totalPrice = itemsPrice + taxPrice - discountAmount;
    return { itemsPrice, taxPrice, totalPrice };
  };

  const applyDiscountHandler = async () => {
    try {
      if (!user) {
        setCheckoutMessage({
          type: "danger",
          text: "You must be logged in to apply a discount.",
        });
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await api.get(
        `/discounts/validate/${discountCode}`,
        config
      );
      if (data.type === "fixed") {
        setDiscountAmount(data.value);
      } else if (data.type === "percentage") {
        const total = cart.reduce((acc, item) => acc + item.mrp * item.qty, 0);
        setDiscountAmount(total * (data.value / 100));
      }
      setCheckoutMessage({ type: "success", text: "Discount applied!" });
    } catch (err) {
      setDiscountAmount(0);
      setCheckoutMessage({
        type: "danger",
        text: err.response?.data?.message || "Invalid discount code",
      });
    }
  };

  const { itemsPrice, taxPrice, totalPrice } = calculateTotals();

  const checkoutHandler = async () => {
    if (cart.length === 0) {
      setCheckoutMessage({ type: "danger", text: "Your cart is empty." });
      return;
    }

    if (!user) {
      setCheckoutMessage({
        type: "danger",
        text: "Please log in or sign up to place an order.",
      });
      return;
    }

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
          paymentMethod: "Online Payment",
          itemsPrice,
          taxPrice,
          discountAmount,
          totalPrice,
        },
        config
      );

      setCart([]);
      setDiscountAmount(0);
      setDiscountCode("");
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
      <h1 className="text-center mb-4">Product Catalog</h1>
      {checkoutMessage && (
        <div className={`alert alert-${checkoutMessage.type}`}>
          {checkoutMessage.text}
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Row>
          <Col md={9}>
            <Row>
              {products.map((product) => (
                <Col
                  key={product._id}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                  className="mb-4"
                >
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>
                        <strong>${product.mrp.toFixed(2)}</strong>
                      </Card.Text>
                      <Card.Text>
                        <Badge bg={product.stock > 0 ? "success" : "danger"}>
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => addToCartHandler(product)}
                        disabled={product.stock === 0}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
          <Col md={3}>
            <Card className="p-4 shadow-sm">
              <h4 className="mb-3">Cart Summary</h4>
              {cart.length === 0 ? (
                <p>Cart is empty.</p>
              ) : (
                <>
                  <ul className="list-unstyled">
                    {cart.map((item) => (
                      <li
                        key={item.product}
                        className="d-flex justify-content-between mb-2"
                      >
                        <span>
                          {item.name} ({item.qty})
                        </span>
                        <span>${(item.mrp * item.qty).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-top pt-2 mt-2">
                    <div className="d-flex justify-content-between">
                      <p>Subtotal:</p>
                      <p>${itemsPrice.toFixed(2)}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>Tax:</p>
                      <p>${taxPrice.toFixed(2)}</p>
                    </div>
                    {discountAmount > 0 && (
                      <div className="d-flex justify-content-between text-success">
                        <p>Discount:</p>
                        <p>-${discountAmount.toFixed(2)}</p>
                      </div>
                    )}
                    <div className="d-flex justify-content-between">
                      <h5 className="fw-bold">Total:</h5>
                      <h5 className="fw-bold">${totalPrice.toFixed(2)}</h5>
                    </div>
                  </div>
                  <Form className="mt-3">
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Enter discount code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={applyDiscountHandler}
                      >
                        Apply
                      </Button>
                    </InputGroup>
                  </Form>
                  <Button
                    variant="success"
                    className="w-100 mt-3"
                    onClick={checkoutHandler}
                    disabled={cart.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProductCatalogScreen;
