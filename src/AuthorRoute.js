import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams, Navigate } from 'react-router-dom';
import {Box, LinearProgress} from "@mui/material";

const AuthorRoute = ({ children }) => {
    const { id } = useParams();
    const [isAuthor, setIsAuthor] = useState(false);
    const { user, authToken } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setIsAuthor(response.data.data.createdById === user.id);
            } catch (error) {
                console.error('Error fetching.', error);
            }
            setLoading(false);
        };
        fetchPost();
    }, [id, authToken, user]);

    if (loading) return (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
            <LinearProgress color="success" />
        </Box>
    );
    return isAuthor ? children : <Navigate to="/" />;
};

export default AuthorRoute;