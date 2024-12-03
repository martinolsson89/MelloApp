import React from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    Divider,
    Card,
    CardContent,
    CardActions,
    Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CrudOperations from '../components/CrudOperations';
import { userService } from '../services/UserService';

const AdminCenter: React.FC = () => {
    const navigate = useNavigate();
    const isAdmin = userService.isAdmin();

    return (
        isAdmin && (
        <>
            <Navbar />
            <Box sx={{ mt: 4, mx: 'auto', p: 3, maxWidth: 800, bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius:2 }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Admin Center
                </Typography>
                <Typography variant="body1" textAlign="center" gutterBottom>
                    Välj en administrativ funktion nedan.
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Resultat
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Hantera resultat för deltävlingar och final.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Stack spacing={1} width="100%">
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        onClick={() => navigate('/admin-center/add-results')}
                                    >
                                        Lägg till resultat för deltävling
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => navigate('/admin-center/add-final-results')}
                                    >
                                        Lägg till resultat för final
                                    </Button>
                                </Stack>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Poäng
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Hantera poäng för deltävlingar och final.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Stack spacing={1} width="100%">
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        onClick={() => navigate('/admin-center/add-scores')}
                                    >
                                        Lägg till poäng för deltävlingar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => navigate('/admin-center/add-final-score')}
                                    >
                                        Lägg till poäng för final
                                    </Button>
                                </Stack>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Användare
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Hantera användare
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Stack spacing={1} width="100%">
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => navigate('/admin-center/delete-all-predictions-by-user')}
                                    >
                                        Ta bort tips för en specifik användare
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => navigate('/admin-center/user-avatar')}
                                        >
                                            Lägg till avatarbild för användare
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={() => navigate('/admin-center/delete-user')}
                                        >
                                            Uppdatera eller Ta bort användare
                                        </Button>
                                </Stack>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Övrigt
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Uppdatera startsidan och andra innehåll.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Stack spacing={1} width="100%">
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() => navigate('/admin-center/update-points')}
                                    >
                                        Uppdatera poäng
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() => navigate('/admin-center/update-home-content')}
                                    >
                                        Uppdatera Startsidan
                                    </Button>
                                </Stack>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 4 }} />
                <CrudOperations />
            </Box>
        </>
        )
    );
};

export default AdminCenter;
