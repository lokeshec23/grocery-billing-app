import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Col, Card, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.user) {
      navigate("/home");
    }
  }, [state.user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await api.post("/users/login", { email, password });
      dispatch({ type: "LOGIN", payload: data });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="d-flex justify-content-center my-5">
      <Col md={6}>
        <Card className="p-4 shadow-sm">
          <Card.Body>
            <h1 className="text-center mb-4">Sign In</h1>
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
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </Button>
                </InputGroup>
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100">
                Sign In
              </Button>
            </Form>
            <div className="text-center mt-3">
              New Customer? <Link to="/register">Register</Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </div>
  );
};

export default LoginScreen;
