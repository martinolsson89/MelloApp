import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Typography, Box, Card, CardContent, CardHeader, List, ListItem, ListItemText, Divider, TextField, Button } from '@mui/material';
import Navbar from "../components/Navbar";
import AuthorizeView, { AuthorizedUser } from "../components/AuthorizeView";

// Define types for SubCompetition and Artist
interface Artist {
    id: string;
    name: string;
    song: string;
    startingNumber: number;
    subCompetitionId: string;
}

interface SubCompetition {
    id: string;
    name: string;
    date: string;
    location: string;
    artists: Artist[];
}

interface Prediction {
    predictedPlacement: number;
    userId: string;
    artistId: string;
    subCompetitionId: string;
}

interface User {
    userId: string;
    email: string;
    firstName: string;
    lastName : string;
}

function Bet() {
    const [subCompetitions, setSubCompetitions] = useState<SubCompetition[]>([]);
    const [predictions, setPredictions] = useState<{ [key: string]: number }>({});
    let emptyuser: User = {userId:"", email: "", firstName:"", lastName:"" };


    const [user, setUser] = useState(emptyuser);



    useEffect(() => {

        // Fetch GET data from the backend

        async function fetchUserId() {
            try {
                let response = await fetch('/Account/pingauthme');
                if (response.status === 200) {
                    let data = await response.json();
                    setUser(data);
                } else {
                    throw new Error('Error fetching data');
                }
            }
            catch (error) {
                console.error(error);
            }
        }


        async function fetchSubCompetitions() {
            try {
                let response = await fetch('/SubCompetition/GetSubCompetitionsWithArtists');
                if (response.status === 200) {
                    let data = await response.json();
                    setSubCompetitions(data);
                } else {
                    throw new Error('Error fetching data');
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserId();
        fetchSubCompetitions();
    }, []);

    const handlePredictionChange = (event: ChangeEvent<HTMLInputElement>, artistId: string) => {
        setPredictions({
            ...predictions,
            [artistId]: parseInt(event.target.value, 10),
        });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        // Replace with actual user ID in a real application
        const userId = user.userId;

        const predictionPayload = {
            predictions: Object.keys(predictions).map(artistId => ({
                predictedPlacement: predictions[artistId],
                userId: userId,
                artistId: artistId,
                subCompetitionId: subCompetitions.find(sub =>
                    sub.artists.some(artist => artist.id === artistId))?.id || ''
            }))
        };

        try {
            const response = await fetch('/Prediction/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(predictionPayload),
            });

            if (response.ok) {
                alert('Predictions submitted successfully!');
                setPredictions({});
            } else {
                throw new Error('Failed to submit predictions');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthorizeView>
            <Navbar />
            <Box sx={{
                mt: 4, textAlign: 'center', maxWidth: 600,
                mx: 'auto',
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.7)'
            }}>
                <Typography variant="h4" gutterBottom>
                    Tävlingsschema och Gissningar
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 3 }}>
                    Hur många poäng får du i år {user.firstName}?
                </Typography>

                <form onSubmit={handleSubmit}>
                    {subCompetitions.map(subCompetition => (
                        <Card key={subCompetition.id} sx={{ mb: 4 }}>
                            <CardHeader
                                title={subCompetition.name}
                                subheader={`${subCompetition.date} - ${subCompetition.location}`}
                            />
                            <CardContent>
                                <Typography variant="h6">Artists:</Typography>
                                <List>
                                    {subCompetition.artists.map(artist => (
                                        <div key={artist.id}>
                                            <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ListItemText
                                                    primary={`${artist.startingNumber}. ${artist.name}`}
                                                    secondary={`Song: ${artist.song}`}
                                                />
                                                <TextField
                                                    label="Predicted Placement"
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ ml: 2, width: 80 }}
                                                    value={predictions[artist.id] || ''}
                                                    onChange={(e) => handlePredictionChange(e, artist.id)}
                                                />
                                            </ListItem>
                                            <Divider />
                                        </div>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    ))}
                    <Button type="submit" variant="contained" color="primary">
                        Submit Predictions
                    </Button>
                </form>
            </Box>
        </AuthorizeView>
    );
}

export default Bet;
