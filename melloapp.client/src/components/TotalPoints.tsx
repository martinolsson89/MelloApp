import { Typography, Box, List, ListItem, ListItemText, Divider, Avatar, ListItemAvatar } from '@mui/material';
import defaultProfilePic from '../assets/avatar/anonymous-user.webp';

interface LeaderboardProps {
    leaderboardData: LeaderboardDto[];
}

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

function TotalPoints({ leaderboardData }: LeaderboardProps) {
    // Optional: Filter out users who haven't made bets
    const filteredLeaderboardData = leaderboardData.filter((entry) => entry.user.hasMadeBet);

    return (
        <Box
            sx={{
                mt: 4,
                textAlign: 'left',
                mx: 'auto',
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: '#f3e5f5',
                maxWidth: 800,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Totalpoäng:
            </Typography>
            <Divider />

            <List>
                {filteredLeaderboardData.map((entry, index) => (
                    <div key={entry.id}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar
                                    src={entry.user.avatarImageUrl || defaultProfilePic}
                                    alt={entry.user.firstName}
                                    sx={{ width: 75, height: 75, m: 1 }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${index + 1}. ${entry.user.firstName}`}
                                secondary={
                                    <Typography variant="body2" fontWeight="bold">
                                        Poäng: {entry.points}
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider />
                    </div>
                ))}
            </List>
        </Box>
    );
}

export default TotalPoints;
