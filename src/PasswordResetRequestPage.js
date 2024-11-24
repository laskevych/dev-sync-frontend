import React, { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

const StyledForm = styled('form')(({ theme }) => ({ width: '100%', maxWidth: 400 }));

function PasswordResetRequestPage() {
    const { authToken } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    if (authToken) {
        return <Navigate to="/" />;
    }

    const handlePasswordResetRequest = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/password-reset/', { email });
            if (response.status === 200) {
                setMessage('An email has been sent to you to reset your password.');
            }
        } catch (error) {
            setError('Email not found.');
        }
    };

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', minHeight: '50vh', alignItems: 'center'}}>
            <StyledForm onSubmit={handlePasswordResetRequest}>
                <Typography variant="h5" align="center" gutterBottom>
                    Password Reset
                </Typography>

                {message && (
                    <Typography variant="body1" align="center" color="success.main" gutterBottom>
                        {message}
                    </Typography>
                )}

                {error && (
                    <Typography variant="body1" align="center" color="error.main" gutterBottom>
                        {error}
                    </Typography>
                )}

                {!message && (
                    <>
                        <TextField
                            color="success"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2 }}
                        >
                            Submit
                        </Button>
                    </>
                )}
            </StyledForm>
        </Container>
    );
}

export default PasswordResetRequestPage;