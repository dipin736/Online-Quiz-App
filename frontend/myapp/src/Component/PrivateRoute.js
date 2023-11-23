import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';


const PrivateRoute = () => {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
