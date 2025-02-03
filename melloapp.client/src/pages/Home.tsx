import { useEffect, useState } from 'react';
import { Typography, Box, Divider, Button, Container, Grid } from '@mui/material';
import AuthorizeView from "../components/AuthorizeView.tsx";
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from '../components/AuthorizedUser';

function Home() {
    const [homeContent, setHomeContent] = useState({
        title: '',
        description: '',
        linkUrl: '',
        linkText: '',
        imageUrl: '',
    });

    useEffect(() => {
        const fetchHomeContent = async () => {
            try {
                const response = await fetch('/HomeContent');
                if (response.ok) {
                    const data = await response.json();
                    setHomeContent({
                        title: data.title || '',
                        description: data.description || '',
                        linkUrl: data.linkUrl || '',
                        linkText: data.linkText || '',
                        imageUrl: data.imageUrl || '',
                    });
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

                    {/* Render only if title is not empty */}
                    {homeContent.title && (
                        <Typography variant="h6" sx={{ mt: 3 }}>
                            {homeContent.title}
                        </Typography>
                    )}

                    <Grid container justifyContent="center" sx={{ mt: 4 }}>
                        <Grid item xs={12} sm={8} md={6}>
                            {/* Render only if imageUrl is not empty */}
                            {homeContent.imageUrl && (
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
                            )}

                            {/* Render only if description is not empty */}
                            {homeContent.description && (
                                <Typography
                                    variant="body1"
                                    sx={{ mt: 1, color: 'text.secondary' }}
                                >
                                    {homeContent.description}
                                </Typography>
                            )}

                            {/* Render only if both linkUrl and linkText exist */}
                            {homeContent.linkUrl && homeContent.linkText && (
                                <Typography variant="body1" sx={{ mt: 2 }}>
                                    <a
                                        href={homeContent.linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {homeContent.linkText}
                                    </a>
                                </Typography>
                            )}
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />
                    <Typography variant="body1">
                        Klicka på <Button variant="text" href="/rules">regler</Button> för att få mer information och läsa reglerna.
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
