// BetReceipt.tsx

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
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
    finalPredictedPlacement: string;
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
    const navigate = useNavigate();
    if (!userData) {
        return <Typography variant="h6">Kunde inte ladda ditt tips för Melodifestivalen.</Typography>;
    }

    const handleNavigation = (path: string) => {
        navigate(path);
    };

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
                bgcolor: 'lightgrey',
            }}
        >
            <Typography variant="h4" fontWeight='bold' gutterBottom>
                Ditt tips
            </Typography>

            {/* Render predictions grouped by sub-competition */}
            {groupedPredictions.map((group) => (
                <Card key={group.subCompetition.name} sx={{ mb: 4}}>
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
                                            secondary={`Ditt tips: ${finalPrediction.finalPredictedPlacement}`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}
            <Button variant="contained" color="secondary" sx={{ m: 2 }} onClick={() => handleNavigation('/bet-overview')}>
                Se hur de andra har tippat här!              
            </Button>
        </Box>
    );
}

export default BetReceipt;
