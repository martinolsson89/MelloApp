import { useEffect, useState } from 'react';
import { Typography, Box, Divider, Button, Container, Grid } from '@mui/material';
import AuthorizeView from "../components/AuthorizeView.tsx";
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from '../components/AuthorizedUser';


function Home() {
    const [homeContent, setHomeContent] = useState({
        title: '',
        description: '',
        imageUrl: '',
    });

    useEffect(() => {
        const fetchHomeContent = async () => {
            try {
                const response = await fetch('/HomeContent');
                if (response.ok) {
                    const data = await response.json();
                    setHomeContent(data);
                } else {
                    console.error('Failed to fetch home content.');
                }
            } catch (err) {
                console.error('Error fetching home content:', err);
            }
        };

        fetchHomeContent();
    }, []);

    return (
        <AuthorizeView>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Box
                    sx={{
                        textAlign: 'center',
                        p: 4,
                        boxShadow: 3,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Välkommen!
                    </Typography>
                    <Typography variant="subtitle1">
                        Du är nu inloggad som användare: <AuthorizedUser value="email" />.
                    </Typography>

                    <Typography variant="h6" sx={{ mt: 3 }}>
                        {homeContent.title}
                    </Typography>

                    <Grid container justifyContent="center" sx={{ mt: 4 }}>
                        <Grid item xs={12} sm={8} md={6}>
                            <Box
                                component="img"
                                src={homeContent.imageUrl}
                                alt="Veckans ledare"
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: 2,
                                    boxShadow: 1,
                                }}
                            />
                            <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
                                {homeContent.description}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />
                    <Typography variant="body1">
                        Klicka på<Button variant="text" href='/rules'>regler</Button>för att få mer information och läsa reglerna.
                    </Typography>

                    <Typography variant="body1">
                        Om du inte bryr dig om regler och sådant strunt, kan du börja tippa direkt!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        href="/bet"
                        sx={{ mt: 2 }}
                    >
                        Rösta nu!
                    </Button>

                </Box>
            </Container>
        </AuthorizeView>
    );
}

export default Home;
