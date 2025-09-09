import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Col, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const StaffRegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { state } = useContext(UserContext);
  const { user } = state;
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not an admin
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await api.post(
        "/users",
        { name, email, password, role: "staff" },
        config
      );

      setMessage("Staff member created successfully!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register staff");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="d-flex justify-content-center my-5">
      <Col md={6}>
        <h1>Register Staff</h1>
        {message && <div className="alert alert-success">{message}</div>}
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

          <Button type="submit" variant="primary">
            Register Staff
          </Button>
        </Form>
      </Col>
    </div>
  );
};

export default StaffRegisterScreen;
