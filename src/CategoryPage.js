import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {useSelector} from "react-redux";
import {Box, Pagination, LinearProgress, Chip, Typography} from '@mui/material';
import { useLocation, useNavigate, useParams} from 'react-router-dom';
import Grid from "@mui/material/Grid2";
import PostItem from './PostItem';

function CategoryPage() {
    const [category, setCategory] = useState({});
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const { authToken, user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/categories/${id}`, {
                headers: authToken 
                    ? { Authorization: `Bearer ${authToken}` } 
                    : {},
            });
            setCategory(response.data.data);
        } catch (error) {
            console.error('Error fetching. ', error);
        }
        setLoading(false);
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(location.search);
            const response = await axios.get(`http://localhost:8080/api/categories/${id}/posts/?${queryParams.toString()}`, {
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
        fetchCategory();
    }, [id, location.search]);

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
        <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ mb: 5, textAlign: "center" }}>
                <Typography variant="h3" gutterBottom>{category.title}</Typography>
                <Typography>{category.description}</Typography>
                {user?.role === 'admin' && (
                    <Chip
                        icon={<ManageAccountsIcon />}
                        variant="outlined"
                        target="_blank"
                        color="primary"
                        sx={{
                            border: 'none',
                            boxShadow: 'none',
                            mt: 2
                        }}
                        label="Modify in Admin Panel"
                        href={`http://localhost:8080/admin/resources/categories/records/${category.id}/show`}
                        clickable
                        component="a"
                    />
                )}
            </Box>
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
        </Grid>
    );
}

export default CategoryPage;