import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link as RouterLink} from "react-router-dom";
import {Box, Grid2 as Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar} from "@mui/material";
import PostList from './PostList';
import Filters from "./Filters";

function formatCreatedAt(timestamp) {
    return (new Date(timestamp)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const TopPostItem = ({post}) => {
    return (
        <ListItem alignItems="flex-start" component={RouterLink} to={`/posts/${post.id}/`} sx={{textDecoration: 'none', color: 'white'}}>
            <ListItemAvatar>
                <Avatar
                    alt={post.author.login}
                    key={post.author.id}
                    component={RouterLink} to={`/users/${post.author.id}/`}
                    src={'http://localhost:8080/profile-pictures/' + post.author.profilePicture}
                />
            </ListItemAvatar>
            <ListItemText primary={post.title} secondary={formatCreatedAt(post.createdAt)}/>
        </ListItem>
    );
};


function MainPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchTopPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/?isTop=1&sortBy=rating:desc&status=active`);
                setPosts(response.data.data);
            } catch (error) {
                console.error('Error fetching. ', error);
            }
        };

        fetchTopPosts();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <List sx={{ width: '100%'}}>
                        {posts.map((post, index) => (
                            (index === 0 || index === 1) && (<TopPostItem key={post.id} post={post} />)
                        ))}
                    </List>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <List sx={{ width: '100%'}}>
                        {posts.map((post, index) => (
                            (index === 2 || index === 3) && (<TopPostItem key={post.id} post={post} />)
                        ))}
                    </List>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Filters/>
                <PostList/>
            </Grid>
        </Box>

    );
}

export default MainPage;