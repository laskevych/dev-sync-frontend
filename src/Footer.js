import React from 'react';
import { Box, Typography } from '@mui/material';
import WebhookIcon from '@mui/icons-material/Webhook';

function Footer() {
    return (
        <Box sx={{ flex: 'row', textAlign: 'center', mt: 'auto', py: 3, backgroundColor: '#1e1e1e' }}>
            <WebhookIcon color="success" fontSize="large"/>
            <Typography variant="body2" color="textSecondary" gutterBottom>DevSync</Typography>
        </Box>
    );
}

export default Footer;