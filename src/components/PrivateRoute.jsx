import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // or a spinner, loading message
    return <div>Loading...</div>;
  }

  if (!user) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // logged in but no permission
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
