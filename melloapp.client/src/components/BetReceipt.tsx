// BetReceipt.tsx

import React from 'react';
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
} from '@mui/material';

interface BetReceiptProps {
    userData: UserDto;
}

// Define interfaces (same as in Bet.tsx)
interface Artist {
    id: string;
    name: string;
    song: string;
    startingNumber: number;
}

interface SubCompetition {
    id: string;
    name: string;
    date: string;
    location: string;
}

interface PredictionDto {
    predictedPlacement: string;
    artistId: string;
    artist: Artist;
    subCompetitionId: string;
    subCompetition: SubCompetition;
}

interface FinalPredictionDto {
    finalPlacement: string;
    artistId: string;
    artist: Artist;
    subCompetitionId: string;
    subCompetition: SubCompetition;
}

interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarImageUrl: string | null;
    hasMadeBet: boolean;
    predictions: PredictionDto[];
    finalPredictions: FinalPredictionDto[];
}

const groupPredictionsBySubCompetition = (predictions: PredictionDto[]) => {
    const grouped: { [key: string]: { subCompetition: SubCompetition; predictions: PredictionDto[] } } = {};

    predictions.forEach((prediction) => {
        const subCompKey = `${prediction.subCompetition.name}-${prediction.subCompetition.date}`;

        if (!grouped[subCompKey]) {
            grouped[subCompKey] = {
                subCompetition: prediction.subCompetition,
                predictions: [],
            };
        }

        grouped[subCompKey].predictions.push(prediction);
    });

    // Convert the grouped object to an array
    const groupedArray = Object.values(grouped);

    // Sort the array by sub-competition date
    groupedArray.sort((a, b) => {
        const dateA = new Date(a.subCompetition.date).getTime();
        const dateB = new Date(b.subCompetition.date).getTime();
        return dateA - dateB;
    });

    // Sort predictions within each group by artist's starting number
    groupedArray.forEach((group) => {
        group.predictions.sort((a, b) => {
            return a.artist.startingNumber - b.artist.startingNumber;
        });
    });

    return groupedArray;
};

function BetReceipt({ userData }: BetReceiptProps) {
    if (!userData) {
        return <Typography variant="h6">Kunde inte ladda ditt tips för Melodifestivalen.</Typography>;
    }

    // Group predictions by sub-competition
    const groupedPredictions = groupPredictionsBySubCompetition(userData.predictions);

    const placementDisplayName = (placement: string) => {
        switch (placement) {
            case 'Final':
                return 'Final';
            case 'FinalKval':
                return 'FinalKval';
            case 'ÅkerUt':
                return 'Åker Ut';
            default:
                return placement;
        }
    };

    return (
        <Box
            sx={{
                mt: 4,
                textAlign: 'center',
                maxWidth: 800,
                mx: 'auto',
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.7)',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Ditt tips
            </Typography>

            {/* Render predictions grouped by sub-competition */}
            {groupedPredictions.map((group) => (
                <Card key={group.subCompetition.name} sx={{ mb: 4 }}>
                    <CardHeader
                        title={group.subCompetition.name}
                        subheader={`${new Date(group.subCompetition.date)
                            .toISOString()
                            .replace('T', ' ')
                            .slice(0, 11)} 20:00 - ${group.subCompetition.location}`}
                    />
                    <CardContent>
                        <List>
                            {group.predictions.map((prediction) => (
                                <div key={prediction.artistId}>
                                    <ListItem>
                                        <ListItemText
                                            primary={`${prediction.artist.startingNumber}. ${prediction.artist.name} - ${prediction.artist.song}`}
                                            secondary={`Ditt tips: ${placementDisplayName(prediction.predictedPlacement)}`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            ))}

            {/* Render final predictions */}
            {userData.finalPredictions.length > 0 && (
                <Card sx={{ mb: 4 }}>
                    <CardHeader title="Finaltips" />
                    <CardContent>
                        <List>
                            {userData.finalPredictions.map((finalPrediction) => (
                                <div key={finalPrediction.artistId}>
                                    <ListItem>
                                        <ListItemText
                                            primary={`${finalPrediction.artist.name} - ${finalPrediction.artist.song}`}
                                            secondary={`Ditt tips: ${finalPrediction.finalPlacement}`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}

export default BetReceipt;
