import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Avatar, Box, Card, CardContent, Chip, LinearProgress, IconButton, Tooltip, Typography, Grid2 as Grid, Link } from '@mui/material';
import axios from 'axios';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import Comments from "./Comments";

function formatCreatedAt(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' - ' +
        date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function PostPage() {
    const { id } = useParams();
    const { authToken, user } = useSelector((state) => state.user);
    const [post, setPost] = useState({});
    const [likes, setLikes] = useState([]);
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLikes = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/${id}/like/`, {
                headers: authToken
                    ? { Authorization: `Bearer ${authToken}` }
                    : {},
            });
            setLikes(response.data.data);
        } catch (error) {
            console.error('Error fetching.', error);
        }
    }

    const fetchFavoritePosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/${user.id}/favorite/`, {
                headers: authToken
                    ? { Authorization: `Bearer ${authToken}` }
                    : {},
            });
            setFavoritePosts(response.data.data);
        } catch (error) {
            console.error('Error fetching. ', error);
        }
    };

    const fetchPost = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
                headers: authToken
                    ? { Authorization: `Bearer ${authToken}` }
                    : {},
            });
            setPost(response.data.data);
        } catch (error) {
            console.error('Error fetching. ', error);
        }
        setLoading(false);
    };

    const handleFavorite = async () => {
        try {
            if (isFavoriteUserPost) {
                await axios.delete(`http://localhost:8080/api/posts/${id}/favorite/`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            } else {
                await axios.post(`http://localhost:8080/api/posts/${id}/favorite`, {}, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            }
            await fetchFavoritePosts();
        } catch (error) {
            console.error('Error handling favorite:', error);
        }
    };

    const addLike = async () => {
        if (!authToken) return;
        try {
            if (isUserLikedThis) {
                const likeId = likes.find((like) => like.type === 'like' && like.author.id === user.id).id;
                await axios.delete(`http://localhost:8080/api/posts/${id}/like/${likeId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            } else {
                await axios.post(`http://localhost:8080/api/posts/${id}/like`, { type: 'like' }, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            }
            await fetchLikes();
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };

    const addDislike = async () => {
        try {
            if (isUserDislikedThis) {
                const dislikeId = likes.find((like) => like.type === 'dislike' && like.author.id === user.id).id;
                await axios.delete(`http://localhost:8080/api/posts/${id}/like/${dislikeId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            } else {
                await axios.post(`http://localhost:8080/api/posts/${id}/like`, { type: 'dislike' }, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            }
            await fetchLikes();
        } catch (error) {
            console.error('Error handling dislike:', error);
        }
    };

    const isFavoriteUserPost = favoritePosts.some((favoritePost) => favoritePost.id === post.id);
    const isUserDislikedThis = likes.some((like) => like.type === 'dislike' && like.author.id === user?.id);
    const isUserLikedThis = likes.some((like) => like.type === 'like' && like.author.id === user?.id);

    useEffect(() => {
        fetchPost();
        if (authToken) {
            fetchFavoritePosts();
        }
        fetchLikes();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <LinearProgress color="success" />
            </Box>
        );
    }

    return (
        <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                <Card variant="outlined" tabIndex={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0, textDecoration: 'none' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', padding: '16px', textDecoration: 'none', color: 'inherit', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', textDecoration: 'none', color: 'inherit' }} component={RouterLink} to={`/users/${post.author.id}/`}>
                            <Avatar key={post.author.id} alt={post.author.login} src={'http://localhost:8080/profile-pictures/' + post.author.profilePicture} sx={{ width: 48, height: 48 }}/>
                            <Typography variant="caption">
                                {post.author.fullName || post.author.login}
                            </Typography>
                        </Box>

                        <Typography variant="caption">{formatCreatedAt(post.createdAt)}</Typography>
                    </Box>
                    <CardContent sx={{ display: 'flex',  flexDirection: 'column',  justifyContent: 'space-between',  height: '100%',  pb: 0 }}>
                        <div>
                            <Typography gutterBottom variant="h6" component="div">
                                {post.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis' }}
                                color="text.secondary"
                                gutterBottom
                            >
                                {post.content}
                            </Typography>
                            <Box sx={{ mt: 3 }}>
                                {post.categories.map((category) => (
                                    <Chip
                                        key={category.id}
                                        label={category.title}
                                        color="default"
                                        sx={{ mr: 1, mb: 1 }}
                                        component={RouterLink}
                                        to={`/categories/${category.id}/posts`}
                                        clickable
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </div>
                    </CardContent>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <IconButton disabled={!authToken} onClick={addLike}>
                                {isUserLikedThis ? <ArrowUpwardIcon color="success" /> : <ArrowUpwardIcon />}
                            </IconButton>
                            <Typography>{likes.filter(like => like.type === 'like').length}</Typography>

                            <IconButton disabled={!authToken} onClick={addDislike}>
                                {isUserDislikedThis ? <ArrowDownwardIcon color="error" /> : <ArrowDownwardIcon />}
                            </IconButton>
                            <Typography>{likes.filter(like => like.type === 'dislike').length}</Typography>

                            {user && (
                                <Tooltip title="Save" placement="top">
                                    <IconButton onClick={handleFavorite} disabled={!authToken}>
                                        {isFavoriteUserPost ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {user?.id === post.author.id && (
                                <Link
                                    component={RouterLink}
                                    to={`/posts/${post.id}/edit/`}
                                    color="success"
                                    underline="none"
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <EditIcon color="success" sx={{ mr: 1 }} />
                                    <Typography color="success" variant="body2">Edit</Typography>
                                </Link>

                            )}

                            {user?.role === 'admin' && (
                                <Link
                                    color="primary"
                                    href={`http://localhost:8080/admin/resources/posts/records/${post.id}/show`}
                                    target="_blank"
                                    underline="none"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <ManageAccountsIcon sx={{ mr: 1 }} color="primary" />
                                    <Typography variant="body2" color="primary">Modify in Admin Panel</Typography>
                                </Link>
                            )}
                        </Box>
                    </Box>
                </Card>
            </Box>

            <Comments post={post}/>
        </Grid>
    );
}

export default PostPage;