import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GuestRoute = ({ children, redirectTo = "/" }) => {
    const { authToken } = useSelector((state) => state.user);
    return !authToken
        ? children
        : <Navigate to={redirectTo} />;
};

export default GuestRoute;