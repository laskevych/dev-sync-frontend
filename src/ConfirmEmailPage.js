import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {Container, Typography, Button, Box} from '@mui/material';
import axios from 'axios';

function ConfirmEmailPage() {
    const { confirm_token } = useParams();
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/auth/confirm-email/${confirm_token}`);
                if (response.status === 200) {
                    setMessage('Your email has been confirmed!');
                    setIsError(false);
                }
            } catch (error) {
                setMessage('Invalid confirmation token.');
                setIsError(true);
            }
        };

        confirmEmail();
    }, [confirm_token]);

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', minHeight: '50vh', alignItems: 'center'}}>
            <Box>
                <Typography variant="h6" align="center" gutterBottom color="success">{message}</Typography>
                {!isError && (
                    <Button
                        color="success"
                        variant="contained"
                        sx={{ mt: 2 }}
                        component={RouterLink}
                        to="/log-in"
                    >
                        Log In
                    </Button>
                )}
            </Box>
        </Container>
    );
}

export default ConfirmEmailPage;