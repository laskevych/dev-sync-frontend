import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

function NotFoundPage() {
    return (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h1" component="h2" sx={{ fontSize: '3rem', mb: 2 }}>Error 404</Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>Page is not found</Typography>
            <Button variant="contained" color="success" component={RouterLink} to="/">Go to home page</Button>
        </Box>
    );
}

export default NotFoundPage;