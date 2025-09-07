import React, { useState, useEffect, useContext, useRef } from "react";
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
  InputGroup,
} from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPrint,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Invoice from "../components/Invoice";

const BillingScreen = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [lastOrder, setLastOrder] = useState(null);

  const invoiceRef = useRef();

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
    const totalPrice = itemsPrice + taxPrice - discountAmount;
    return { itemsPrice, taxPrice, totalPrice };
  };

  const applyDiscountHandler = async () => {
    try {
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

      const { data } = await api.post(
        "/orders",
        {
          orderItems,
          paymentMethod: "Cash",
          itemsPrice,
          taxPrice,
          discountAmount,
          totalPrice,
        },
        config
      );

      setLastOrder(data); // Store the created order
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

  const handlePrint = () => {
    window.print();
  };

  const handlePDFExport = () => {
    const input = document.getElementById("invoice-content");
    if (!input) {
      setCheckoutMessage({
        type: "danger",
        text: "Invoice content not found for export.",
      });
      return;
    }

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png"); // ensures valid base64
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${lastOrder._id.substring(18)}.pdf`);
    });
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Point of Sale</h1>
      {checkoutMessage && (
        <div
          className={`alert alert-${checkoutMessage.type} d-flex justify-content-between align-items-center`}
        >
          <span>{checkoutMessage.text}</span>
          {checkoutMessage.type === "success" && (
            <div>
              <Button variant="info" onClick={handlePDFExport} className="ms-3">
                <FontAwesomeIcon icon={faFilePdf} /> Export PDF
              </Button>
              <Button
                variant="secondary"
                onClick={handlePrint}
                className="ms-2"
              >
                <FontAwesomeIcon icon={faPrint} /> Print
              </Button>
            </div>
          )}
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
                            <FontAwesomeIcon icon={faTrash} />
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
                {discountAmount > 0 && (
                  <div className="d-flex justify-content-between text-success">
                    <p>Discount:</p>
                    <p>-${discountAmount.toFixed(2)}</p>
                  </div>
                )}
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                  <h5 className="fw-bold">Total:</h5>
                  <h5 className="fw-bold">${totalPrice.toFixed(2)}</h5>
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
      {lastOrder && (
        <div
          id="invoice-content"
          style={{ position: "absolute", left: "-9999px", top: 0 }}
        >
          <Invoice orderData={lastOrder} />
        </div>
      )}
    </Container>
  );
};

export default BillingScreen;
