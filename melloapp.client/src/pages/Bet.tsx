import { useState, useEffect, FormEvent } from 'react';
import {
    Typography,
    Box,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemText,
    Divider,
    Select,
    MenuItem,
    SelectChangeEvent,
    Button,
    Alert,
} from '@mui/material';
import Navbar from '../components/Navbar';
import AuthorizeView from '../components/AuthorizeView';

// Define the ePlacement enum
enum ePlacement {
    Final = 'Final',
    FinalKval = 'FinalKval',
    ÅkerUt = 'ÅkerUt',
}

// Define the eFinalPlacement enum
enum eFinalPlacement {
    Vinnare = 'Vinnare',
    Tvåa = 'Tvåa',
}

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
    predictedPlacement: ePlacement;
    userId: string;
    artistId: string;
    subCompetitionId: string;
}

interface FinalPrediction {
    finalPlacement: eFinalPlacement;
    userId: string;
    artistId: string;
    subCompetitionId: string;
}

interface User {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
}

function Bet() {
    const [subCompetitions, setSubCompetitions] = useState<SubCompetition[]>([]);
    const [allArtists, setAllArtists] = useState<Artist[]>([]);
    const [predictions, setPredictions] = useState<{ [key: string]: ePlacement }>({});
    const [finalPredictions, setFinalPredictions] = useState<{[key in eFinalPlacement]?: string;}>({});

    const emptyUser: User = { userId: '', email: '', firstName: '', lastName: '' };
    const [user, setUser] = useState(emptyUser);

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch data from the backend
        async function fetchUserId() {
            try {
                let response = await fetch('/Account/pingauthme');
                if (response.status === 200) {
                    let data = await response.json();
                    setUser(data);
                } else {
                    throw new Error('Error fetching user data');
                }
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchSubCompetitions() {
            try {
                let response = await fetch('/SubCompetition/GetSubCompetitionsWithArtists');
                if (response.status === 200) {
                    let data = await response.json();
                    setSubCompetitions(data);

                    // Extract all artists
                    const artists = data.flatMap((sub: SubCompetition) => sub.artists);
                    setAllArtists(artists);
                } else {
                    throw new Error('Error fetching sub-competitions');
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchUserId();
        fetchSubCompetitions();
    }, []);

    const handlePredictionChange = (event: SelectChangeEvent<unknown>, artistId: string) => {
        setPredictions({
            ...predictions,
            [artistId]: event.target.value as ePlacement,
        });
    };

    const handleFinalPredictionChange = (
        event: SelectChangeEvent<unknown>,
        placement: eFinalPlacement
    ) => {
        setFinalPredictions({
            ...finalPredictions,
            [placement]: event.target.value as string,
        });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        // Clear any existing error message
        setErrorMessage('');

        // Validation: Check predictions for each sub-competition
        for (const subCompetition of subCompetitions) {
            const artistIds = subCompetition.artists.map((artist) => artist.id);
            const subPredictions = artistIds.map((artistId) => predictions[artistId]);

            // Check if all predictions are made for this sub-competition
            if (subPredictions.some((placement) => !placement)) {
                setErrorMessage(`Please make a prediction for every artist in ${subCompetition.name}.`);
                return;
            }

            // Count the number of predictions for each placement
            const counts: { [key in ePlacement]: number } = {
                [ePlacement.Final]: 0,
                [ePlacement.FinalKval]: 0,
                [ePlacement.ÅkerUt]: 0,
            };

            subPredictions.forEach((placement) => {
                counts[placement]++;
            });

            // Validate counts
            if (
                counts[ePlacement.Final] !== 2 ||
                counts[ePlacement.FinalKval] !== 2 ||
                counts[ePlacement.ÅkerUt] !== 2
            ) {
                setErrorMessage(
                    `In ${subCompetition.name}, you must select exactly 2 artists for each placement: Final, FinalKval, and Åker Ut.`
                );
                return;
            }
        }

        // Validation for final predictions
        if (
            !finalPredictions[eFinalPlacement.Vinnare] ||
            !finalPredictions[eFinalPlacement.Tvåa]
        ) {
            setErrorMessage('Please select both the winner and the runner-up in the final.');
            return;
        }

        if (
            finalPredictions[eFinalPlacement.Vinnare] === finalPredictions[eFinalPlacement.Tvåa]
        ) {
            setErrorMessage('The winner and runner-up cannot be the same artist.');
            return;
        }

        const userId = user.userId;

        // Prepare payloads for predictions and final predictions
        const predictionPayload: { predictions: Prediction[] } = {
            predictions: Object.keys(predictions).map((artistId) => ({
                predictedPlacement: predictions[artistId] as string,
                userId: userId,
                artistId: artistId,
                subCompetitionId:
                    subCompetitions.find((sub) =>
                        sub.artists.some((artist) => artist.id === artistId)
                    )?.id || '',
            })),
        };

        const finalPredictionPayload: { predictions: FinalPrediction[] } = {
            predictions: Object.keys(finalPredictions).map((placement) => {
                const artistId = finalPredictions[placement as eFinalPlacement];
                const subCompetitionId =
                    allArtists.find((artist) => artist.id === artistId)?.subCompetitionId || '';

                return {
                    finalPlacement: placement as string,
                    userId: userId,
                    artistId: artistId!,
                    subCompetitionId: subCompetitionId,
                };
            }),
        };

        try {
            // Submit regular predictions
            const predictionResponse = await fetch('/Prediction/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(predictionPayload),
            });

            // Submit final predictions
            const finalPredictionResponse = await fetch('/FinalPrediction/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalPredictionPayload),
            });

            if (predictionResponse.ok && finalPredictionResponse.ok) {
                alert('All predictions submitted successfully!');
                setPredictions({});
                setFinalPredictions({});
            } else {
                throw new Error('Failed to submit predictions');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred while submitting your predictions. Please try again.');
        }
    };

    return (
        <AuthorizeView>
            <Navbar />
            <Box
                sx={{
                    mt: 4,
                    textAlign: 'center',
                    maxWidth: 600,
                    mx: 'auto',
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Tävlingsschema och Gissningar
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 3 }}>
                    Hur många poäng får du i år {user.firstName}?
                </Typography>

                <form onSubmit={handleSubmit}>
                    {subCompetitions.map((subCompetition) => (
                        <Card key={subCompetition.id} sx={{ mb: 4 }}>
                            <CardHeader
                                title={subCompetition.name}
                                subheader={`${subCompetition.date} - ${subCompetition.location}`}
                            />
                            <CardContent>
                                <Typography variant="h6">Artists:</Typography>
                                <List>
                                    {subCompetition.artists.map((artist) => (
                                        <div key={artist.id}>
                                            <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ListItemText
                                                    primary={`${artist.startingNumber}. ${artist.name}`}
                                                    secondary={`Song: ${artist.song}`}
                                                />
                                                <Select
                                                    value={predictions[artist.id] || ''}
                                                    onChange={(e) => handlePredictionChange(e, artist.id)}
                                                    displayEmpty
                                                    sx={{
                                                        ml: 2,
                                                        width: 150,
                                                        bgcolor: predictions[artist.id]
                                                            ? 'inherit'
                                                            : 'rgba(255, 0, 0, 0.1)',
                                                    }}
                                                >
                                                    <MenuItem value="">
                                                        <em>Placering</em>
                                                    </MenuItem>
                                                    <MenuItem value={ePlacement.Final}>Final</MenuItem>
                                                    <MenuItem value={ePlacement.FinalKval}>FinalKval</MenuItem>
                                                    <MenuItem value={ePlacement.ÅkerUt}>Åker Ut</MenuItem>
                                                </Select>
                                            </ListItem>
                                            <Divider />
                                        </div>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Card for Winner Prediction */}
                    <Card sx={{ mb: 4 }}>
                        <CardHeader title="Vinnare i finalen" />
                        <CardContent>
                            <Select
                                value={finalPredictions[eFinalPlacement.Vinnare] || ''}
                                onChange={(e) =>
                                    handleFinalPredictionChange(e, eFinalPlacement.Vinnare)
                                }
                                displayEmpty
                                sx={{ width: '100%' }}
                            >
                                <MenuItem value="">
                                    <em>Välj artist</em>
                                </MenuItem>
                                {allArtists.map((artist) => (
                                    <MenuItem key={artist.id} value={artist.id}>
                                        {artist.name} - {artist.song}
                                    </MenuItem>
                                ))}
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Card for Runner-up Prediction */}
                    <Card sx={{ mb: 4 }}>
                        <CardHeader title="Tvåa i finalen" />
                        <CardContent>
                            <Select
                                value={finalPredictions[eFinalPlacement.Tvåa] || ''}
                                onChange={(e) =>
                                    handleFinalPredictionChange(e, eFinalPlacement.Tvåa)
                                }
                                displayEmpty
                                sx={{ width: '100%' }}
                            >
                                <MenuItem value="">
                                    <em>Välj artist</em>
                                </MenuItem>
                                {allArtists.map((artist) => (
                                    <MenuItem key={artist.id} value={artist.id}>
                                        {artist.name} - {artist.song}
                                    </MenuItem>
                                ))}
                            </Select>
                        </CardContent>
                    </Card>

                    <Button type="submit" variant="contained" color="primary">
                        Skicka in gissningarna
                    </Button>
                </form>
                {/* Display error message if any */}
                {errorMessage && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Box>
                )}
            </Box>
        </AuthorizeView>
    );
}

export default Bet;
