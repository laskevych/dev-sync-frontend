import React, { useState, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Container, TextField, Button, Typography, Link } from '@mui/material';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const StyledForm = styled('form')(({ theme }) => ({ width: '100%', maxWidth: 400 }));

function PasswordResetConfirmPage() {
    const { authToken } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        password: '',
        password_confirm: '',
    });
    const { confirm_token } = useParams();
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    if (authToken) {
        return <Navigate to="/" />;
    }
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordResetConfirm = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('');

        try {
            const response = await axios.post(
                `http://localhost:8080/api/auth/password-reset/${confirm_token}`,
                formData
            );

            if (response.status === 200) {
                setMessage('success');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
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
                setMessage('Please try again.');
            }
        }
    };

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', minHeight: '50vh', alignItems: 'center'}}>
            <StyledForm onSubmit={handlePasswordResetConfirm}>
                <Typography variant="h5" align="center" gutterBottom>Reset Password</Typography>

                {message === 'success' && (
                    <Typography variant="body1" align="center" color="success" gutterBottom>
                        Your password has been changed. You can{' '}
                        <Link color="success" href="/src/PasswordResetConfirmPage">Log In</Link>.
                    </Typography>
                )}

                {message && message !== 'success' && (
                    <Typography variant="body1" align="center" color="error" gutterBottom>
                        {message}
                    </Typography>
                )}

                {!message && (
                    <>
                        <TextField
                            color="success"
                            variant="outlined"
                            margin="normal"
                            helperText={errors.password}
                            required
                            fullWidth
                            name="password"
                            label="New Password"
                            value={formData.password}
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            onChange={handleChange}
                            error={!!errors.password}
                            
                        />

                        <TextField
                            error={!!errors.password_confirm}
                            color="success"
                            variant="outlined"
                            margin="normal"
                            required
                            value={formData.password_confirm}
                            fullWidth
                            name="password_confirm"
                            label="Confirm New Password"
                            type="password"
                            helperText={errors.password_confirm}
                            id="password_confirm"
                            autoComplete="new-password"
                            onChange={handleChange}
                        />

                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>Submit</Button>
                    </>
                )}
            </StyledForm>
        </Container>
    );
}

export default PasswordResetConfirmPage;