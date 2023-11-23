import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [validationError, setValidationError] = useState(null);

  const checkEmail = async (email) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3030/api/check-email/?email=${email}`
      );
      const data = await response.json();
      return data.isEmailRegistered;
    } catch (error) {
      console.error("Error checking email:", error);
      return false; // Assume email is not registered in case of an error
    }
  };

  const handleRegister = async () => {
    try {
      // Check if any field is empty
      if (Object.values(userData).some((value) => value === "")) {
        setValidationError("Please fill in all fields.");
        return;
      }

      // Check if password is at least 4 characters long
      if (userData.password.length < 4) {
        setValidationError("Password must be at least 4 characters long.");
        return;
      }

      // Check if passwords match
      if (userData.password !== userData.confirmPassword) {
        setValidationError("Passwords do not match.");
        return;
      }

      // Check if email is already registered
      const isEmailRegistered = await checkEmail(userData.email);
      if (isEmailRegistered) {
        setValidationError("Email is already registered.");
        return;
      }

      // Perform registration
      await register(userData);
      setValidationError(null); // Clear validation error on successful registration
      navigate("/"); // Redirect to the home page upon successful registration
    } catch (error) {
      console.error("Registration error:", error);
      setValidationError("Registration failed. Please try again.");
    }
  };

  return (
    <Container className="mt-5  shadow">
      <h2>Register</h2>
      {validationError && <p className="text-danger">{validationError}</p>}
      <Form>
        <Form.Group controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            value={userData.firstName}
            onChange={(e) =>
              setUserData({ ...userData, firstName: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            value={userData.lastName}
            onChange={(e) =>
              setUserData({ ...userData, lastName: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={userData.confirmPassword}
            onChange={(e) =>
              setUserData({ ...userData, confirmPassword: e.target.value })
            }
          />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
            </InputGroup>
        </Form.Group>
        <Button className="m-3 " variant="outline-danger" size="lg" onClick={handleRegister}>
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
