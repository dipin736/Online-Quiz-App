import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [validationError, setValidationError] = useState(null);

  const handleLogin = async () => {
    try {
      if (!credentials.username || !credentials.password) {
        setValidationError('Please fill in all fields.');
        return;
      }

      const { token, user_id, email } = await login(credentials);

      if (token) {
        console.log('User Email:', email); 
        navigate("/quiz");
      } else {
        setValidationError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setValidationError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Container>
      <h2>Login</h2>
      {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
      <Form className='m-4 p-5 shadow'>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
        </Form.Group>

        <Button variant="outline-success" size="lg" className='m-3' onClick={handleLogin}>
          Login
        </Button>
        <br></br>
        <Button variant="primary" li className='m-3'as={Link} to='/register'>
        Dont't have an account? 
                        Register
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
