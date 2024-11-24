import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const { authToken } = useContext(AuthContext);
  if (!authToken) {
    return <Navigate to="/log-in" />;
  }

  return children;
}

export default PrivateRoute;