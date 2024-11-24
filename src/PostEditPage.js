import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import PostFormPage from './PostFormPage';

function PostEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const { authToken } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchPost = async () => {
            const response = await axios.get(`http://localhost:8080/api/posts/${id}`, { headers: { Authorization: `Bearer ${authToken}` } });
            setPost(response.data.data);
        };
        fetchPost();
    }, [id, authToken]);

    const handleEditPost = async (payload) => {
        await axios.patch(`http://localhost:8080/api/posts/${id}/`, payload, { headers: { Authorization: `Bearer ${authToken}` }});
    };

    const handleDelete = async () => {
        await axios.delete(`http://localhost:8080/api/posts/${id}/`, { headers: { Authorization: `Bearer ${authToken}` }} );
        navigate('/');
    };

    return post ? <PostFormPage
        post={post}
        onSubmit={handleEditPost}
        onDelete={handleDelete}
    /> : <div>Haha :)</div>;
}

export default PostEditPage;