import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import Navbar from "../components/Navbar";
import TotalPoints from "../components/TotalPoints";
import SubCompetitionPoints from '../components/SubCompetitionPoints';
import { userService } from '../services/UserService';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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

interface SubCompetitionWithScoresDto {
    subCompetitionId: string;
    name: string;
    date: string;
    userScores: UserScoreDto[];
}

interface UserScoreDto {
    userId: string;
    firstName: string;
    lastName: string;
    avatarImageUrl: string;
    points: number;
}


function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardDto[]>([]);
    const [subCompetitionData, setSubCompetitionData] = useState<SubCompetitionWithScoresDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isLoggedIn = userService.isLoggedIn();

    useEffect(() => {
        async function fetchData() {
            try {
                let response = await fetch('/Leaderboard');
                if (response.status === 200) {
                    let data = await response.json();
                    setLeaderboardData(data);
                } else {
                    throw new Error('Error fetching data');
                }
            } catch (error) {
                console.error(error);
                setError('Kunde inte hämta leaderboard-data.');
                setIsLoading(false);
            }
        }

        async function fetchSubCompetitionData() {
            try {
                let response = await fetch('/ScoreAfterSubCompetition/GetLeaderboardBySubCompetition');
                if (response.status === 200) {
                    let data = await response.json();
                    setSubCompetitionData(data);
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
        fetchSubCompetitionData();

    }, []);

    return (
        isLoggedIn && (
            <>
                <Navbar />
                {isLoading ? (
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: 'white' }}>Laddar...</Typography>
                    </Box>
                ) : error ? (
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="error">
                            {error}
                        </Typography>
                    </Box>
                ) : (
                    <Box>
                        import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

                        <Box
                            sx={{
                                mt: 4,
                                boxShadow: 1,
                                borderRadius: 1,
                                bgcolor: 'background.paper',
                                p: 2
                            }}
                        >
                            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>
                                Här ser du alla ledartavlor
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary', mr: 1 }}>
                                    Gå till:
                                </Typography>
                                {subCompetitionData.map((sub, i) => (
                                    <a
                                        key={sub.subCompetitionId}
                                        href={`#subCompetition-${sub.subCompetitionId}`}
                                        style={{
                                            marginRight: i < subCompetitionData.length - 1 ? '12px' : '0',
                                            textDecoration: 'none',
                                            color: '#1976d2',
                                            display: 'inline-flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {sub.name}
                                        <KeyboardArrowDownIcon
                                            sx={{
                                                fontSize: '1rem',
                                                ml: '4px',
                                                verticalAlign: 'middle',
                                                color: '#1976d2'
                                            }}
                                        />
                                    </a>
                                ))}
                            </Typography>
                        </Box>


                        <TotalPoints leaderboardData={leaderboardData} />
                        <SubCompetitionPoints subCompetitionData={subCompetitionData} />
                    </Box>
                )}
            </>
        )
    );
}

export default Leaderboard;
