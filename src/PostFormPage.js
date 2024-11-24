import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from "react-router-dom";
import { TextField, Button, Typography, Checkbox, ListItemText, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function PostFormPage({ post, onSubmit, onDelete }) {
    const [title, setTitle] = useState(post?.title || '');
    const [content, setContent] = useState(post?.content || '');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(post?.categories || []);
    const [status, setStatus] = useState(post?.status || 'active');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSavePost = async (e) => {
        e.preventDefault();
        setErrors({});

        const payload = { title,  content,  status,  categories: selectedCategories.map(category => category.id).join(',')};

        try {
            await onSubmit(payload);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const validationErrs = error.response.data.validationErrs;
                const errors = {};
                validationErrs.forEach((err) => {
                    errors[err.path] = err.msg;
                });
                setErrors(errors);
            }
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/categories/');
                setCategories(response.data.data);

                if (post && post.categories) {
                    const currentCategories = response.data.data.filter(category =>
                        post.categories.some(choosen => choosen.id === category.id)
                    );
                    setSelectedCategories(currentCategories);
                }
            } catch (error) {
                console.error('Error fetching. ', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <Box component="form" onSubmit={handleSavePost} sx={{ width: '100%', maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                {post ? 'Edit Post' : 'Create Post'}
            </Typography>
            <TextField
                color="success"
                label="Title"
                value={title}
                error={!!errors.title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                helperText={errors.title}
                margin="normal"
                required
            />
            <TextField
                color="success"
                label="Content"
                margin="normal"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
                helperText={errors.content}
                required
                multiline
                rows={6}
                error={!!errors.content}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Categories</InputLabel>
                <Select multiple value={selectedCategories} onChange={(e) => setSelectedCategories(e.target.value)} renderValue={(selected) => selected.map(cat => cat.title).join(', ')}>
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category}>
                            <Checkbox checked={selectedCategories.includes(category)} />
                            <ListItemText primary={category.title} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box sx={{mt: 2}}>
                <Button onClick={() => navigate(-1)} variant="contained" color="default" fullWidth>Back</Button>
                <Button sx={{ mt: 3 }} type="submit" variant="contained" color="success" fullWidth>Save</Button>
                {onDelete && (
                    <Button sx={{ mt: 3 }} variant="outlined" color="error" onClick={onDelete} fullWidth>Delete</Button>
                )}
            </Box>
        </Box>
    );
}

export default PostFormPage;