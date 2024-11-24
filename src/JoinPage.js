import React, { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import {Container, TextField, Button, Typography, Grid2 as Grid, Box, Link} from '@mui/material';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

const StyledForm = styled('form')(({ theme }) => ({ width: '100%', maxWidth: 500 }));

function JoinPage() {
    const [formData, setFormData] = useState({
        login: '',
        email: '',
        fullName: '',
        password: '',
        password_confirm: '',
    });

    const [errors, setErrors] = useState({});
    const [registeredEmail, setRegisteredEmail] = useState('');
    const { authToken } = useContext(AuthContext);
    if (authToken) {
        return <Navigate to="/" />;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', formData);
            if (response.status === 201) {
                setRegisteredEmail(response.data.data.email);
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
                console.error('Registration error:', error);
            }
        }
    };

    if (registeredEmail.length) {
        return (
            <Container sx={{
                display: 'flex',
                justifyContent: 'center',
                minHeight: '50vh',
                alignItems: 'center'
            }}>
                <Typography variant="h6" align="center">Please confirm your email address. We've sent a confirmation email to {registeredEmail}.</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', minHeight: '50vh', alignItems: 'center'}}>
            <StyledForm onSubmit={handleJoin}>
                <Typography variant="h5" align="center" gutterBottom>Join</Typography>

                <TextField
                    color="success"
                    value={formData.login}
                    variant="outlined"
                    margin="normal"
                    required
                    error={!!errors.login}
                    fullWidth
                    id="login"
                    label="Login"
                    helperText={errors.login}
                    name="login"
                    autoComplete="username"
                    onChange={handleChange}
                />

                <TextField
                    color="success"
                    variant="outlined"
                    margin="normal"
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!errors.email}
                    id="email"
                    label="Email"
                    helperText={errors.email}
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                />

                <TextField
                    onChange={handleChange}
                    color="success"
                    value={formData.fullName}
                    variant="outlined"
                    margin="normal"
                    helperText={errors.fullName}
                    label="Full Name"
                    required
                    error={!!errors.fullName}
                    fullWidth
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                />

                <TextField
                    color="success"
                    variant="outlined"
                    margin="normal"
                    value={formData.password}
                    required
                    fullWidth
                    helperText={errors.password}
                    name="password"
                    label="Password"
                    type="password"
                    error={!!errors.password}
                    id="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                />

                <TextField
                    color="success"
                    variant="outlined"
                    margin="normal"
                    onChange={handleChange}
                    required
                    fullWidth
                    value={formData.password_confirm}
                    name="password_confirm"
                    label="Confirm Password"
                    type="password"
                    error={!!errors.password_confirm}
                    id="password_confirm"
                    autoComplete="new-password"
                    helperText={errors.password_confirm}
                />

                <Button type="submit" fullWidth color="success" variant="contained" sx={{ mt: 3 }}>Join</Button>

                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid size={12}>
                        <Box>
                            <Typography align="center" color="success">
                                Already have an account? <Link color="success" href="/log-in">Log In</Link>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </StyledForm>
        </Container>
    );
}

export default JoinPage;