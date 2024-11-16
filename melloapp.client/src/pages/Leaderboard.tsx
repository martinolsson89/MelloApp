import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import Navbar from "../components/Navbar";
import AuthorizeView from "../components/AuthorizeView";
import TotalPoints from "../components/TotalPoints";
import SubCompetitionPoints from '../components/SubCompetitionPoints';

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
                <Box>
                            <TotalPoints leaderboardData={leaderboardData} />
                            <SubCompetitionPoints subCompetitionData={subCompetitionData} />
                </Box>
            )}
        </AuthorizeView>
    );
}

export default Leaderboard;
