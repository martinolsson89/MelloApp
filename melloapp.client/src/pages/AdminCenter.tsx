// AdminCenter.tsx

import React from 'react';
import { Box, Typography, Button, Stack, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthorizeAdminView from '../components/AuthorizeAdminView';
import Navbar from '../components/Navbar';
import CrudOperations from '../components/CrudOperations';

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
                    bgcolor: 'whitesmoke',
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
                        sx={{ backgroundColor: 'red' }}
                        onClick={() => navigate('/admin-center/add-final-results')}
                    >
                        Lägg till resultat för final
                    </Button>
                    <Divider sx={{ my: 2 }} />
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: 'green' }}
                        onClick={() => navigate('/admin-center/add-scores')}
                    >
                        Lägg till poäng för deltävlingar
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: 'blue' }}
                        onClick={() => navigate('/admin-center/add-final-score')}
                    >
                        Lägg till poäng för final
                    </Button>
                    <Divider sx={{ my: 2 }} />
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: 'orange' }}
                        onClick={() => navigate('/admin-center/update-points')}
                    >
                        Uppdatera poäng
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: 'purple' }}
                        onClick={() => navigate('/admin-center/update-home-content')}
                    >
                        Uppdatera Startsidan
                    </Button>
                    {/* Add more buttons for other functionalities */}
                </Stack>
                <CrudOperations />
            </Box>
        </AuthorizeAdminView>
    );
};

export default AdminCenter;
