import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    Box,
    Avatar,
    Typography,
    Button,
    Card,
    LinearProgress,
    Chip,
    Tabs,
    Tab,
    Grid2 as Grid,
} from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PostItem from "./PostItem";

function UserPage() {
    const { user, authToken } = useSelector((state) => state.user);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${id}`, {
                    headers: authToken
                        ? { Authorization: `Bearer ${authToken}` }
                        : {},
                });
                setUserData(response.data.data);
            } catch (error) {
                console.error('Error fetching.', error);
            }
            setLoading(false);
        };

        const fetchFavoritePosts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${id}/favorite/`, {
                    headers: authToken
                        ? { Authorization: `Bearer ${authToken}` }
                        : {},
                });
                setFavoritePosts(response.data.data);
            } catch (error) {
                console.error('Error fetching. ', error);
            }
        };

        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${id}/posts/`, {
                    headers: authToken
                        ? { Authorization: `Bearer ${authToken}` }
                        : {},
                });
                setUserPosts(response.data.data);
            } catch (error) {
                console.error('Error fetching. ', error);
            }
        };

        fetchUserData();
        fetchUserPosts();
        fetchFavoritePosts();
    }, [id, authToken]);

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}><LinearProgress color="success" /></Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 3, gap: 3 }}>
            <Grid container spacing={1} sx={{ justifyContent: 'center' }}>
                <Card sx={{ padding: 4, maxWidth: 400, textAlign: 'center' }}>
                    <Avatar
                        src={`http://localhost:8080/profile-pictures/${userData.profilePicture}`}
                        alt={userData.fullName || userData.login}
                        sx={{ width: 200, height: 200, margin: '0 auto' }}
                    />
                    <Typography variant="h5" sx={{ mt: 3 }}>
                        {userData.fullName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {userData.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Rating: {userData.rating}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Role: {userData.role.toUpperCase()}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {user?.id === userData.id && (
                            <Button
                                color="success"
                                variant="contained"
                                sx={{ mt: 4 }}
                                component={RouterLink}
                                to={`/users/${id}/edit`}
                            >
                                Edit
                            </Button>
                        )}
                    </Box>

                    {user?.role === 'admin' && (
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Chip
                                icon={<ManageAccountsIcon />}
                                color="primary"
                                variant="outlined"
                                sx={{ border: 'none', boxShadow: 'none', mt: 2}}
                                label="Modify in Admin Panel"
                                href={`http://localhost:8080/admin/resources/users/records/${userData.id}/show`}
                                component="a"
                                target="_blank"
                                clickable
                            />
                        </Box>
                    )}
                </Card>
            </Grid>

            <Box sx={{ bgcolor: 'background.paper', width: '100%' }}>
                <Tabs
                    onChange={handleChangeTab}
                    value={tabValue}
                    variant="fullWidth"
                    centered
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab label="Posts"/>
                    <Tab label="Favorites" />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <Box sx={{ width: '100%' }}>
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 2 }}>
                        {userPosts.map((post) => (
                            <Grid size={{ xs: 12, md: 6 }} key={post.id}>
                                <PostItem post={post} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {tabValue === 1 && (
                <Box sx={{ width: '100%' }}>
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 2 }}>
                        {favoritePosts.map((post) => (
                            <Grid size={{ xs: 12, md: 6 }} key={post.id}>
                                <PostItem post={post} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
}

export default UserPage;