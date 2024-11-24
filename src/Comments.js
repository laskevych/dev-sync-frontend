import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {Box, Avatar, Typography, IconButton, TextField, Button, Tooltip} from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BlockIcon from '@mui/icons-material/Block';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function formatCreatedAt(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { minute: '2-digit', hour: '2-digit', hour12: false }) + ' ' + date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

const CommentItem = ({ comment, post, onCommentUpdate, onDelete, updateCommentInState, level }) => {
    const { authToken, user } = useSelector((state) => state.user);
    const [likes, setLikes] = useState([]);
    const [content, setContent] = useState(comment.content);
    const [editMode, setEditMode] = useState(false);

    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const fetchLikes = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/comments/${comment.id}/like`);
            setLikes(response.data.data);
        } catch (error) {
            console.error('Error. ', error);
        }
    };

    useEffect(() => {
        fetchLikes();
    }, [comment.id]);

    const addLike = async () => {
        if (!authToken) return;
        try {
            if (isUserLikedThis) {
                const likeId = likes.find((like) => like.type === 'like' && like.author.id === user.id).id;
                await axios.delete(`http://localhost:8080/api/comments/${comment.id}/like/${likeId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            } else {
                await axios.post(`http://localhost:8080/api/comments/${comment.id}/like`, { type: 'like' }, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            }
            await fetchLikes();
        } catch (error) {
            console.error('Error. ', error);
        }
    };

    const addDislike = async () => {
        if (!authToken) return;
        try {
            if (isUserDislikedThis) {
                const dislikeId = likes.find((like) => like.type === 'dislike' && like.author.id === user.id).id;
                await axios.delete(`http://localhost:8080/api/comments/${comment.id}/like/${dislikeId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            } else {
                await axios.post(`http://localhost:8080/api/comments/${comment.id}/like`, { type: 'dislike' }, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            }
            await fetchLikes();
        } catch (error) {
            console.error('Error. ', error);
        }
    };

    const handleSave = async () => {
        try {
            await axios.patch(`http://localhost:8080/api/comments/${comment.id}`, { content }, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setEditMode(false);
            onCommentUpdate();
        } catch (error) {
            console.error('Error. ', error);
        }
    };

    const handleDisable = async () => {
        try {
            await axios.patch(`http://localhost:8080/api/comments/${comment.id}`, { content, status: 'inactive' }, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            updateCommentInState(comment.id, { status: 'inactive' });
        } catch (error) {
            console.error('Error. ', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/comments/${comment.id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            onDelete();
        } catch (error) {
            console.error('Error. ', error);
        }
    };

    const handleBest = async () => {
        try {
            await axios.patch(`http://localhost:8080/api/comments/${comment.id}/setBest`, {}, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            updateCommentInState(comment.id, { isBest: true });
        } catch (error) {
            console.error('Error. ', error);
        }
    };

    const handleAddReply = async () => {
        if (!replyContent.trim()) return;
        try {
            const response = await axios.post(`http://localhost:8080/api/posts/${post.id}/comments`, {
                content: replyContent,
                commentId: comment.id,
            }, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            updateCommentInState(comment.id, {
                comments: [...(comment.comments || []), response.data.data]
            });
            setReplyContent('');
            setShowReplyForm(false);
        } catch (error) {
            console.error('Error ', error);
        }
    };

    const isUserLikedThis = likes.some(like => like.type === 'like' && like.author.id === user?.id);
    const isUserDislikedThis = likes.some(like => like.type === 'dislike' && like.author.id === user?.id);
    const userCanSetBest = !comment.isBest && post.author.id === user?.id;

    return (
        <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1, mb: 2, opacity: comment.status === 'inactive' ? 0.5 : 1 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center',
                    mb: 2
                }}
            >
                <Box
                    sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                    component={RouterLink}
                    to={`/users/${comment.author.id}/`}
                >
                    <Avatar
                        key={comment.author.id}
                        alt={comment.author.login}
                        src={'http://localhost:8080/profile-pictures/' + comment.author.profilePicture}
                        sx={{ width: 24, height: 24 }}
                    />
                    <Typography variant="caption">
                        {comment.author.fullName || comment.author.login}
                    </Typography>
                </Box>
                <Typography>•</Typography>
                <Typography variant="caption">{formatCreatedAt(comment.createdAt)}</Typography>
            </Box>
            {editMode ? (
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                        color="success"
                        fullWidth
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        value={content}
                        size="small"
                    />
                </Box>
            ) : (
                <Typography variant="body2">{content}</Typography>
            )}
            <Box sx={{display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between'}}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton
                        onClick={addLike}
                        disabled={!authToken}
                        size="small"
                    >
                        {isUserLikedThis ? <ArrowUpwardIcon color="success"/> : <ArrowUpwardIcon />}
                    </IconButton>
                    <Typography variant="caption">{likes.filter(like => like.type === 'like').length}</Typography>
                    <IconButton onClick={addDislike} disabled={!authToken}>
                        {isUserDislikedThis ? <ArrowDownwardIcon color="error" /> : <ArrowDownwardIcon />}
                    </IconButton>
                    <Typography variant="caption">{likes.filter(like => like.type === 'dislike').length}</Typography>
                    {userCanSetBest ?
                        <Button onClick={handleBest} size="small" color="warning" startIcon={<StarBorderIcon />}>Best</Button>
                        : (comment.isBest || comment.isBest === 1) && (
                            <Tooltip title="Best" placement="top">
                                <span>
                                    <IconButton disabled size="small">{comment.isBest ? <StarIcon color="warning" /> : <StarBorderIcon />}</IconButton>
                                </span>
                            </Tooltip>
                        )
                    }

                    {authToken && level < 2 && (
                        <Button onClick={() => setShowReplyForm(!showReplyForm)} size="small" color="success" startIcon={<ReplyAllIcon color="success" />}>Reply</Button>
                    )}

                    {(user?.role === 'admin') && (
                        <Button size="small" color="primary" startIcon={<ManageAccountsIcon />} href={`http://localhost:8080/admin/resources/comments/records/${comment.id}/show`} component="a" clickable target="_blank">Modify in Admin Panel</Button>
                    )}

                    {(user?.id === comment.author.id && !editMode && comment.status === 'active') && (
                        <Button onClick={() => setEditMode(!editMode)} size="small" color="default" startIcon={<EditNoteIcon />}>Edit</Button>
                    )}

                    {(user?.id === comment.author.id && editMode) && (
                        <Button onClick={handleSave} size="small" color="success" startIcon={<SaveAsIcon />}>Save</Button>
                    )}

                    {(user?.id === comment.author.id && comment.status === 'active') && (
                        <Button onClick={handleDisable} size="small" color="primary" startIcon={<BlockIcon />}>Disable</Button>
                    )}

                    {user?.id === comment.author.id && (
                        <Button onClick={handleDelete} size="small" color="error" startIcon={<DeleteForeverIcon />}>Delete</Button>
                    )}
                </Box>
            </Box>

            {authToken && (
                <>
                    {showReplyForm && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 1 }}>
                            <TextField color="success" fullWidth placeholder="Add a reply" value={replyContent} onChange={(e) => setReplyContent(e.target.value)} multiline size="small"/>
                            <Button onClick={handleAddReply} variant="contained" color="success" startIcon={<AddCommentIcon />}>Add</Button>
                        </Box>
                    )}
                </>
            )}

            {comment.comments?.map(reply => (
                level < 2 && (
                    <CommentItem key={reply.id} comment={reply} post={post} onCommentUpdate={onCommentUpdate} onDelete={onDelete} updateCommentInState={updateCommentInState} level={level+1} />
                )
            ))}
        </Box>
    );
};

function Comments({ post }) {
    const { authToken } = useSelector(state => state.user);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/${post.id}/comments`);
                setComments(response.data.data);
            } catch (error) {
                console.error('Error fetching.', error);
            }
        };

        fetchComments();
    }, [post]);

    const updateCommentInState = (commentId, updatedFields) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === commentId
                    ? { ...comment, ...updatedFields }
                    : {
                        ...comment,
                        comments: comment.comments.map(reply =>
                            reply.id === commentId ? { ...reply, ...updatedFields } : reply
                        )
                    }
            )
        );
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const response = await axios.post(`http://localhost:8080/api/posts/${post.id}/comments`, { content: newComment }, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setComments([response.data.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <Box sx={{mt: 2}}>
            {authToken && (
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField color="success" fullWidth placeholder="Add a comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} multiline/>
                    <Button onClick={handleAddComment} variant="contained" color="success" startIcon={<AddCommentIcon />}>Add</Button>
                </Box>
            )}
            {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} post={post} onCommentUpdate={() => setComments(prev => prev)} onDelete={() => setComments(prev => prev.filter(c => c.id !== comment.id))} updateCommentInState={updateCommentInState} level={1}/>
            ))}
        </Box>
    );
}

export default Comments;