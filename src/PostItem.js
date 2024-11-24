import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Typography, Card, CardContent, Chip, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CommentIcon from '@mui/icons-material/Comment';
import BlockIcon from '@mui/icons-material/Block';

function formatCreatedAt(timestamp) {
    return (new Date(timestamp)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function PostItem({ post }) {
    return  (
        <Card
            tabIndex={0}
            sx={{
                opacity: post.status === 'inactive' ? 0.6 : 1,
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
                textDecoration: 'none',
                height: '100%'
            }}
        >
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 2, padding: '16px', textDecoration: 'none', color: 'inherit', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center'
                }}
                >
                    <Box to={`/users/${post.author.id}/`} sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', textDecoration: 'none', color: 'inherit' }} component={RouterLink}>
                        <Avatar key={post.author.id} src={'http://localhost:8080/profile-pictures/' + post.author.profilePicture} alt={post.author.login} sx={{ width: 48, height: 48 }}/>
                        <Typography variant="caption">{post.author.fullName || post.author.login}</Typography>
                    </Box>
                </Box>
                <Typography variant="caption">{formatCreatedAt(post.createdAt)}</Typography>
            </Box>
            <CardContent
                component={RouterLink}
                sx={{
                    color: 'white',
                    textDecoration: 'none'
                }}
                to={`/posts/${post.id}/`}
            >
                <div>
                    <Typography gutterBottom variant="h6" component="div">
                        {post.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        sx={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textDecoration: 'none'
                        }}
                    >
                        {post.content.substring(0, 194)}...
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        {post.categories.map((category) => (
                            <Chip sx={{ mr: 1, mb: 1 }} key={category.id} label={category.title} clickable to={`/categories/${category.id}/posts`} component={RouterLink} variant="outlined" color="default"/>
                        ))}
                    </Box>
                </div>
            </CardContent>

            <Box sx={{display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between', padding: '16px', marginTop: 'auto'}}>
                <Chip icon={<ArrowUpwardIcon />} color="default" variant="outlined" label={post.likes} sx={{border: 'none', boxShadow: 'none'}}  />
                {post.status === 'inactive' && (
                    <Chip icon={<BlockIcon/>} label="Inactive" variant="outlined" color="default" sx={{border: 'none', boxShadow: 'none'}}></Chip>
                )}
                <Chip icon={<CommentIcon />} color="default" variant="outlined" label={post.commentsCount} sx={{border: 'none', boxShadow: 'none'}} />
            </Box>
        </Card>
    )
}

export default PostItem;