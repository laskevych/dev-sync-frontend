import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

function PublicRoute({ children }) {
    const { authToken } = useContext(AuthContext);
    if (authToken) {
        return <Navigate to="/" />;
    }

    return children;
}

export default PublicRoute;