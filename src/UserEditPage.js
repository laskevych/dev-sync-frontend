import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Avatar, IconButton } from '@mui/material';
import { setUser } from './store/userSlice';

function UserEditPage() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, authToken } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({ fullName: '', password: '', password_confirm: '' });
    const [avatar, setAvatar] = useState(null);
    const [userData, setUserData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${id}`, {
                    headers: authToken
                        ? { Authorization: `Bearer ${authToken}` }
                        : {},
                });
                setUserData(response.data.data);
                setFormData((previousData) => ({
                    ...previousData,
                    fullName: response.data.data.fullName,
                }));
            } catch (error) {
                console.error('Error fetching.', error);
            }
        };
        fetchUserData();
    }, [id, authToken]);

    const handleAvatarChange = (e) => { setAvatar(e.target.files[0]);};
    const handleChange = (e) => { setFormData({...formData, [e.target.name]: e.target.value})};
    const handleEdit = async (e) => {
        e.preventDefault();
        setErrors({});

        const payload = { fullName: formData.fullName };

        if (formData.password) {
            payload.password = formData.password;
            payload.password_confirm = formData.password_confirm;
        }

        try {
            const response = await axios.patch(`http://localhost:8080/api/users/${id}`, payload, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            dispatch(setUser({ authToken, user: {...user, fullName: response.data.data.fullName}}));

            navigate(`/users/${id}`);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const validationErrs = error.response.data.validationErrs;
                const formErrors = {};
                validationErrs.forEach((err) => {
                    formErrors[err.path] = err.msg;
                });
                setErrors(formErrors);
            }
        }
    };

    const handleProfilePictureChange = async () => {
        if (!avatar) return;
        const formData = new FormData();
        formData.append('profilePicture', avatar);
        try {
            const response = await axios.patch(`http://localhost:8080/api/users/${id}/avatar`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            dispatch(setUser({authToken, user: {...user, profilePicture: response.data.data.profilePicture}}));
            navigate(`/users/${id}`);
        } catch (error) {
            console.error('Error uploading picture:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleEdit} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Avatar
                    src={`http://localhost:8080/profile-pictures/${userData.profilePicture}`}
                    alt={userData.fullName || userData.login}
                    sx={{ width: 200, height: 200, mt: 2 }}
                />
                <IconButton component="label" sx={{ mt: 2 }}>
                    <input type="file" hidden onChange={handleAvatarChange} />
                    <Typography>New Avatar</Typography>
                </IconButton>
                <Button color="success" onClick={handleProfilePictureChange} variant="contained" sx={{ mt: 2 }}>
                    Upload Avatar
                </Button>
            </Box>
            <TextField
                color="success"
                label="Full Name"
                name="fullName"
                required
                margin="normal"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                helperText={errors.fullName}
                error={!!errors.fullName}
            />
            <TextField
                color="success"
                helperText={errors.password}
                label="New Password"
                name="password"
                type="password"
                error={!!errors.password}
                value={formData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                color="success"
                helperText={errors.password_confirm}
                name="password_confirm"
                type="password"
                value={formData.password_confirm}
                onChange={handleChange}
                label="Confirm Password"
                fullWidth
                margin="normal"
                error={!!errors.password_confirm}
            />
            <Box sx={{mt: 2}}>
                <Button type="submit" variant="contained" color="success" fullWidth>
                    Save
                </Button>
                <Button variant="contained" color="default" sx={{ mt: 2 }} fullWidth onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Box>
        </Box>
    );
}

export default UserEditPage;