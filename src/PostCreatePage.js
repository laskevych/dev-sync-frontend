import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PostFormPage from './PostFormPage';

function PostCreatePage() {
    const navigate = useNavigate();
    const { authToken } = useSelector((state) => state.user);
    const handleSubmit = async (payload) => {
        const res = await axios.post('http://localhost:8080/api/posts/', payload, { headers: { Authorization: `Bearer ${authToken}` } });
        if (res.status === 201) {
            navigate(`/posts/${res.data.data.id}/edit`);
        }
    };

    return <PostFormPage onSubmit={handleSubmit} />;
}

export default PostCreatePage;