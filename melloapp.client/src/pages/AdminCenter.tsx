// AdminCenter.tsx

import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthorizeAdminView from '../components/AuthorizeAdminView';
import Navbar from '../components/Navbar';

const AdminCenter: React.FC = () => {
    const navigate = useNavigate();

    return (
        <AuthorizeAdminView>
            <Navbar />
            <Box
                sx={{
                    mt: 4,
                    textAlign: 'center',
                    mx: 'auto',
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Admin Center
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Välj en administrativ funktion nedan.
                </Typography>
                <Stack spacing={2} direction="column" alignItems="center" sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/admin-center/add-results')}
                    >
                        Lägg till resultat för deltävling
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/admin-center/add-scores')}
                    >
                        Lägg till resultat för deltävling
                    </Button>
                    {/* Add more buttons for other functionalities */}
                </Stack>
            </Box>
        </AuthorizeAdminView>
    );
};

export default AdminCenter;
