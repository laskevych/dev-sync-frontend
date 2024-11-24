import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useSelector} from "react-redux";
import {useNavigate, useLocation} from 'react-router-dom';
import {Box, Pagination, LinearProgress, Grid2 as Grid } from '@mui/material';
import PostItem from './PostItem';

function PostList() {
    const { authToken } = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(location.search);
            const response = await axios.get(`http://localhost:8080/api/posts/?${queryParams.toString()}`, {
                headers: authToken
                    ? { Authorization: `Bearer ${authToken}` }
                    : {},
            });
            setPosts(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching. ', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, [location.search]);

    const handlePageChange = (event, value) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('page', value);
        navigate(`${location.pathname}?${queryParams.toString()}`);
    };

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <LinearProgress color="success" />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 2 }}>
                {posts.map((post) => (
                    <Grid size={{ xs: 12, md: 6 }} key={post.id}>
                        <PostItem post={post} />
                    </Grid>
                ))}
            </Grid>

            {pagination && pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.currentPage}
                        onChange={handlePageChange}
                        color="success"
                    />
                </Box>
            )}
        </Box>
    );
}

export default PostList;