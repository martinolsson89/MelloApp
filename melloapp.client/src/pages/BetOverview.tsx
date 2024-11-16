import { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    Avatar,
    ListItemAvatar,
    Grid,
} from '@mui/material';
import Navbar from '../components/Navbar';
import AuthorizeView from '../components/AuthorizeView';
import defaultProfilePic from '../assets/avatar/anonymous-user.webp';

interface GetSubCompetitionWithArtistsAndPredictionsDto {
    id: string;
    name: string;
    date: string;
    location: string;
    artists: Artist[];
}

interface Artist {
    id: string;
    name: string;
    song: string;
    startingNumber: number;
    predictions: Prediction[];
}

interface Prediction {
    id: string;
    predictedPlacement: string;
    user: User;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    avatarImageUrl: string;
    hasMadeBet: boolean;
}

function BetOverview() {
    const [betOverviewData, setBetOverviewData] = useState<GetSubCompetitionWithArtistsAndPredictionsDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                let response = await fetch('/SubCompetition/GetSubCompetitionsWithArtistsAndPredictions');
                if (response.status === 200) {
                    let data = await response.json();
                    console.log('API Data:', data); // Inspect data
                    setBetOverviewData(data);
                    setIsLoading(false);
                } else {
                    throw new Error('Error fetching data');
                }
            } catch (error) {
                console.error(error);
                setError('Kunde inte hämta tips-data');
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    // Filter users who have made bets and sort artists by startingNumber
    const filteredBetOverviewData = betOverviewData.map((subComp) => ({
        ...subComp,
        artists:
            subComp.artists
                ?.map((artist) => ({
                    ...artist,
                    predictions: artist.predictions?.filter((prediction) => prediction.user.hasMadeBet) || [],
                }))
                .sort((a, b) => a.startingNumber - b.startingNumber) || [],
    }));

    return (
        <AuthorizeView>
            <Navbar />
            {isLoading ? (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h6">Laddar...</Typography>
                </Box>
            ) : error ? (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        mt: 4,
                        textAlign: 'left',
                        mx: 'auto',
                        p: 3,
                        boxShadow: 3,
                        borderRadius: 2,
                        bgcolor: '#f3e5f5',
                        maxWidth: 1200,
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Tipshörnan
                    </Typography>
                    <Typography variant="body1">
                        Här kan du se hur släkten har tippat i Mello.
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    {/* Display each subcompetition in its own Box */}
                    {filteredBetOverviewData.map((subComp) => (
                        <Box
                            key={subComp.id}
                            sx={{
                                mb: 4,
                                p: 2,
                                boxShadow: 2,
                                borderRadius: 2,
                                bgcolor: 'white',
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                {subComp.name} - {new Date(subComp.date)
                                    .toISOString()
                                    .replace('T', ' ')
                                    .slice(0, 11)}
                            </Typography>
                            <Divider sx={{ my: 1 }} />

                            {/* Artists displayed horizontally using Grid */}
                            <Grid container spacing={2}>
                                {subComp.artists?.map((artist) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={artist.id}>
                                        <Box
                                            sx={{
                                                p: 2,
                                                border: '1px solid #ccc',
                                                borderRadius: 2,
                                                height: '80%',
                                            }}
                                        >
                                            <Typography variant="h6" gutterBottom>
                                                {artist.startingNumber}. {artist.song}
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                "{artist.name}"
                                            </Typography>
                                            <Divider sx={{ my: 1 }} />
                                            <List dense>
                                                {artist.predictions?.map((prediction) => (
                                                    <ListItem key={prediction.id} alignItems="flex-start">
                                                        <ListItemAvatar>
                                                            <Avatar
                                                                src={prediction.user.avatarImageUrl || defaultProfilePic}
                                                                alt={`${prediction.user.firstName} ${prediction.user.lastName}`}
                                                            />
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={`${prediction.user.firstName} ${prediction.user.lastName}`}
                                                            secondary={`Tippat: ${prediction.predictedPlacement}`}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ))}
                </Box>
            )}
        </AuthorizeView>
    );
}

export default BetOverview;
