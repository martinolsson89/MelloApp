import { useState, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Divider, Avatar, ListItemAvatar } from '@mui/material';
import Navbar from "../components/Navbar.tsx";
import AuthorizeView from "../components/AuthorizeView.tsx";
import defaultProfilePic from '../assets/avatar/anonymous-user.webp';

interface LeaderboardDto {
    id: string;
    points: number;
    userId: string;
    user: GetUserDto;
}

interface GetUserDto {
    id: string;
    firstName: string;
    lastName: string;
    avatarImageUrl: string | null;
    hasMadeBet: boolean;
}

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                let response = await fetch('/Leaderboard');
                if (response.status === 200) {
                    let data = await response.json();
                    setLeaderboardData(data);
                    setIsLoading(false);
                } else {
                    throw new Error('Error fetching data');
                }
            } catch (error) {
                console.error(error);
                setError('Kunde inte hämta leaderboard-data.');
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    // Optional: Filter out users who haven't made bets
    const filteredLeaderboardData = leaderboardData.filter((entry) => entry.user.hasMadeBet);

    return (
        <AuthorizeView>
            <Navbar />
            <Box
                sx={{
                    mt: 4,
                    textAlign: 'center',
                    mx: 'auto',
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    maxWidth: 800,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Leaderboard
                </Typography>

                {isLoading ? (
                    <Typography variant="h6">Laddar...</Typography>
                ) : error ? (
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                ) : (
                   <List>
                        {filteredLeaderboardData.map((entry, index) => (
                            <div key={entry.id}>
                                <ListItem>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center', // Centers items vertically
                                            width: '100%'
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                src={entry.user.avatarImageUrl || defaultProfilePic}
                                                alt={entry.user.firstName}
                                                sx={{ width: 56, height: 56, mb: 1}}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{ textAlign: 'center' }}
                                            primary={`${index + 1}. ${entry.user.firstName}`}
                                            secondary={`Poäng: ${entry.points}`}
                                        />
                                    </Box>
                                </ListItem>
                                <Divider />
                            </div>
                        ))}
                    </List>
                )}
            </Box>
        </AuthorizeView>
    );
}

export default Leaderboard;
