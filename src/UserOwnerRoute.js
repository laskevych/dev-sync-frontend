import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Navigate } from 'react-router-dom';

const UserOwnerRoute = ({ children }) => {
    const { user } = useSelector((state) => state.user);
    const { id } = useParams();
    return user.id === parseInt(id, 10)
        ? children
        : <Navigate to="/" />;
};

export default UserOwnerRoute;