import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import Navbar from '../components/Navbar';
import AuthorizeView from '../components/AuthorizeView';
import BetForm from '../components/BetForm'; // Import the new component

// Define types for SubCompetition, Artist, and User
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

interface User {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    hasMadeBet: boolean;
}

function Bet() {
    const [subCompetitions, setSubCompetitions] = useState<SubCompetition[]>([]);
    const [allArtists, setAllArtists] = useState<Artist[]>([]);
    const emptyUser: User = { userId: '', email: '', firstName: '', lastName: '', hasMadeBet: false };
    const [user, setUser] = useState(emptyUser);
    const [hasBet, setHasBet] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        // Fetch data from the backend
        async function fetchUserId() {
            try {
                let response = await fetch('/Account/pingauthme');
                if (response.status === 200) {
                    let data = await response.json();
                    setUser(data);
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
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        }

        fetchUserId();
        fetchSubCompetitions();

    }, []);

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
            >   {isLoading ? (
                <Typography variant="h6">Laddar...</Typography>
                ) : hasBet ? ( <Typography variant="h6">Ditt tips är inskickat och registrerat.</Typography>
                ) : (
                <>
                <Typography variant="h4" gutterBottom>
                    Här fyller du i ditt tips för Melodifestivalen 2025.
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 3 }}>
                    Hur många poäng får du i år {user.firstName}?
                </Typography>

                {/* Pass the necessary props to BetForm */}
                <BetForm
                    subCompetitions={subCompetitions}
                    allArtists={allArtists}
                    user={user}
                    onBetSubmitted={() => setHasBet(true) }
                />
                </>
                )}
            </Box>
        </AuthorizeView>
    );
}

export default Bet;
