import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { UserContext } from "../context/UserContext";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (state.user) {
      navigate("/home");
    }
  }, [state.user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await api.post(
        "/users/login",
        { email, password },
        config
      );

      dispatch({ type: "LOGIN", payload: data });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Col md={6}>
        <h1>Sign In</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Sign In
          </Button>
        </Form>
        <Row className="py-3">
          <Col>
            New Customer? <Link to="/register">Register</Link>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default LoginScreen;
