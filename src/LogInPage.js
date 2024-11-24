import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {Container, TextField, Button, Typography, Link, Grid2 as Grid} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from './store/userSlice';

const StyledForm = styled('form')(({ theme }) => ({ width: '100%', maxWidth: 400 }));

function LogInPage() {
    const [formData, setFormData] = useState({ login: '', password: '',});
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);

            if (response.status === 200) {
                dispatch(setUser({
                    authToken: response.data.accessToken,
                    user: response.data.data
                }));
                navigate('/');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const validationErrs = error.response.data.validationErrs;
                const formErrors = {};

                validationErrs.forEach((err) => {
                    const field = err.path;
                    if (!formErrors[field]) {
                        formErrors[field] = err.msg;
                    }
                });

                setErrors(formErrors);
            } else {
                console.error('Login error:', error);
            }
        }
    };

    return (
        <Container sx={{
            display: 'flex',
            justifyContent: 'center',
            minHeight: '50vh',
            alignItems: 'center'
        }}>
            <StyledForm onSubmit={handleLogin}>
                <Typography variant="h5" align="center" gutterBottom>Log In</Typography>
                <TextField
                    color="success"
                    margin="normal"
                    variant="outlined"
                    required
                    fullWidth
                    value={formData.login}
                    onChange={handleChange}
                    helperText={errors.login}
                    id="login"
                    label="Login"
                    name="login"
                    error={!!errors.login}
                    autoComplete="username"
                />
                <TextField
                    color="success"
                    variant="outlined"
                    value={formData.password}
                    margin="normal"
                    required
                    fullWidth
                    error={!!errors.password}
                    name="password"
                    label="Password"
                    type="password"
                    onChange={handleChange}
                    id="password"
                    autoComplete="current-password"
                    helperText={errors.password}
                />
                <Button
                    color="success"
                    type="submit"
                    sx={{ mt: 2 }}
                    fullWidth
                    variant="contained"
                >
                    Log In
                </Button>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid size={12}>
                        <Typography align="center" color="success">
                            <Link color="success" href="/password-reset">Password Reset</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </StyledForm>
        </Container>
    );
}

export default LogInPage;