import { Typography, Box, Divider, Button, Container, Grid } from '@mui/material';
import AuthorizeView, { AuthorizedUser } from "../components/AuthorizeView.tsx";
import Navbar from "../components/Navbar.tsx";

function Home() {
    const imageUrl = 'https://mellopedia.svt.se/images/thumb/5/5e/Edvin_T%C3%B6rnblom_och_Kristina_Keyyo_Petrushina_programledare_2025.jpg/1599px-Edvin_T%C3%B6rnblom_och_Kristina_Keyyo_Petrushina_programledare_2025.jpg?20241107162646';

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
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Välkommen!
                    </Typography>
                    <Typography variant="subtitle1">
                        Du är nu inloggad som användare: <AuthorizedUser value="email" />.
                    </Typography>

                    <Typography variant="h6" sx={{ mt: 3 }}>
                        Varje vecka kommer vi presentera veckans ledare i tävlingen här!
                    </Typography>

                    <Grid container justifyContent="center" sx={{ mt: 4 }}>
                        <Grid item xs={12} sm={8} md={6}>
                            <Box
                                component="img"
                                src={imageUrl}
                                alt="Veckans ledare"
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: 2,
                                    boxShadow: 1,
                                }}
                            />
                            <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
                                Edvin Törnblom och Kristina "Keyyo" Petrushina, programledare 2025.
                            </Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="body1">
                        Kom igång med tippandet:
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
