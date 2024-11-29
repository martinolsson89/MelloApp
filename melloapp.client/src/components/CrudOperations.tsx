// CrudOperations.tsx

import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/UserService';

const CrudOperations: React.FC = () => {
    const IsAdmin = userService.isAdmin();
    const navigate = useNavigate();

    return (
        IsAdmin && (
            <>
                <Box
                    sx={{
                        mt: 4,
                        textAlign: 'center',
                        mx: 'auto',
                        p: 2,
                        boxShadow: 3,
                        borderRadius: 2,
                        bgcolor: 'white',
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        CRUD Operationer
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Hantera Artister, deltävlingar, Resultat, Poäng.
                    </Typography>
                    <Stack spacing={1} width="100%" sx={{ mt: 4 }}>
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
                        <Button
                            variant="contained"
                            onClick={() => navigate('/admin-center/results-management')}
                        >
                            Hantera resultat
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/admin-center/points-management')}
                        >
                            Hantera poäng
                        </Button>

                    </Stack>
                </Box>
            </>
        )
    );
};

export default CrudOperations;
