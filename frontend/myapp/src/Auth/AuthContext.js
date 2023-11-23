import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem('authToken');
  const [user, setUser] = useState(storedToken ? { token: storedToken } : null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setUser({ token: storedToken });
    }
  }, []);

const login = async (credentials) => {
  try {
    setLoading(true);
    const response = await fetch('http://127.0.0.1:3030/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('authToken', userData.token);
      setError(null);
      return userData;

    } else {
      setError(`Login failed: ${response.status} ${response.statusText}`);
      window.alert('Invalid credentials. Please try again.');
      return { token: null, user: null, email: null }; // Return an object with null values
    }
  } catch (error) {
    setError(`Error during login: ${error.message}`);
    return { token: null, user: null, email: null }; // Return an object with null values
  } finally {
    setLoading(false);
  }
};

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:3030/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        const userDataWithToken = await response.json();
        setUser(userDataWithToken.user);
        localStorage.setItem('authToken', userDataWithToken.token);
        localStorage.setItem('userEmail', userDataWithToken.email);
        setError(null);
      } else {
        setError(`Registration failed: ${response.status} ${response.statusText}`);
        // window.alert('Registration failed. Please try again.');

      }
    } catch (error) {
      setError(`Error during registration: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  const logout = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:3030/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUser(null);
        localStorage.removeItem('authToken');
        setError(null);
      } else {
        setError(`Logout failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setError(`Error during logout: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, error, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
