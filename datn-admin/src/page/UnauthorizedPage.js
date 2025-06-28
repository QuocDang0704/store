import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Typography, Container, Box } from '@mui/material';

function UnauthorizedPage() {

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" align="center" gutterBottom>
                    401 - Không được phép truy cập
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                    Bạn không có quyền truy cập trang này
                </Typography>
            </Box>
        </Container>
    );
}

export default UnauthorizedPage;
