import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css"; // Style matches login box

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset link sent! Check your inbox and spam folder.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2 className="text-center mb-3">Forgot Password</h2>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleReset}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Enter your registered email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-grid">
            <Button type="submit" variant="primary">
              Send Reset Email
            </Button>
          </div>
        </Form>

        <div className="mt-3 text-center">
          <Button
            variant="link"
            className="text-decoration-none"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
