// Bet.tsx

import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import Navbar from '../components/Navbar';
import AuthorizeView from '../components/AuthorizeView';
import BetForm from '../components/BetForm';
import BetReceipt from '../components/BetReceipt';

// Define types for SubCompetition, Artist, and UserDto
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
    email: string;
    firstName: string;
    lastName: string;
    hasMadeBet: boolean;
    predictions: PredictionDto[];
    finalPredictions: FinalPredictionDto[];
}

function Bet() {
    const [subCompetitions, setSubCompetitions] = useState<SubCompetition[]>([]);
    const [allArtists, setAllArtists] = useState<Artist[]>([]);
    const [userData, setUserData] = useState<UserDto | null>(null);
    const [hasBet, setHasBet] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [randomSentence, setRandomSentence] = useState('');

    // Move data fetching functions outside of useEffect
    async function fetchUserData() {
        try {
            const userResponse = await fetch('/Users/getUserInfo');
            if (userResponse.ok) {
                const data: UserDto = await userResponse.json();
                setUserData(data);
                setHasBet(data.hasMadeBet);
            } else {
                throw new Error('Error fetching user data');
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchSubCompetitions() {
        try {
            const subCompetitionsResponse = await fetch('/SubCompetition/GetSubCompetitionsWithArtists');
            if (subCompetitionsResponse.ok) {
                const data: SubCompetition[] = await subCompetitionsResponse.json();
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

    function GenerateSentences() {
        const sentences = [
            'Hur många poäng får du i år ',
            'Är det i år du vinner släktkampen ',
            'Blir du årets Mellodiva ',
        ];

        const randomIndex = Math.floor(Math.random() * sentences.length);

        setRandomSentence(sentences[randomIndex]);
    }
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            await fetchUserData();
            await fetchSubCompetitions();
            GenerateSentences();
            setIsLoading(false);
        }

        fetchData();
    }, []);

    // Handle bet submission
    const handleBetSubmitted = async () => {
        setIsLoading(true);
        await fetchUserData(); // Re-fetch user data to get the latest predictions
        setIsLoading(false);
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
                {isLoading ? (
                    <Typography variant="h6">Laddar...</Typography>
                ) : hasBet ? (
                    <>
                        <BetReceipt userData={userData} />
                    </>
                ) : (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Här fyller du i ditt tips!
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mb: 3 }}>
                            {randomSentence}
                            {userData?.firstName}?
                        </Typography>

                        {/* Pass the necessary props to BetForm */}
                        <BetForm
                            subCompetitions={subCompetitions}
                            allArtists={allArtists}
                            user={userData}
                            onBetSubmitted={handleBetSubmitted}
                        />
                    </>
                )}
            </Box>
        </AuthorizeView>
    );
}

export default Bet;
