import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const { user } = state;

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await api.post("/users/register-customer", {
        name,
        email,
        password,
      });

      dispatch({ type: "LOGIN", payload: data });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="d-flex justify-content-center my-5">
      <Col md={6}>
        <Card className="p-4 shadow-sm">
          <Card.Body>
            <h1 className="text-center mb-4">Sign Up</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
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
              <Button type="submit" variant="primary" className="w-100">
                Register
              </Button>
            </Form>
            <div className="text-center mt-3">
              Already have an account? <Link to="/">Sign In</Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </div>
  );
};

export default RegisterScreen;
