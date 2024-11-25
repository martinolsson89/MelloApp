// CrudOperations.tsx

import React from 'react';
import { Box, Typography, Button, Stack, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CrudOperations: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                mt: 4,
                textAlign: 'center',
                mx: 'auto',
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'whitesmoke',
            }}
        >
            <Typography variant="h5" gutterBottom>
                CRUD Operations
            </Typography>
            <Typography variant="body1" gutterBottom>
                Hantera Artister och deltävlingar
            </Typography>
            <Stack spacing={2} direction="column" alignItems="center" sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={() => navigate('/admin-center/artists')}
                >
                    Hantera artister
                </Button>
                <Button
                    variant="contained"
                    onClick={() => navigate('/admin-center/sub-competitions')}
                >
                    Hantera deltävlingar
                </Button>
            </Stack>
        </Box>
    );
};

export default CrudOperations;
