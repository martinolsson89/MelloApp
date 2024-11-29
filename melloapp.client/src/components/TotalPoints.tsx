import { Typography, Box, List, ListItem, ListItemText, Avatar, ListItemAvatar, Badge } from '@mui/material';
import defaultProfilePic from '../assets/avatar/anonymous-user.webp';
import kingCrown from '../assets/king.png';

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
                // p: 3,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: '#f3e5f5',
                maxWidth: 800,
            }}
        >
            <Box sx={{ backgroundColor: '#9e20b0', boxShadow: 2, p: 2, textAlign: 'center', borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }} gutterBottom>
                    Totalpoäng
                </Typography>
            </Box>
            {/* <Divider sx={{m:2}} /> */}
            <Box sx={{ px: 3 }}>
                <List>
                    {filteredLeaderboardData.map((entry, index) => (
                        <div key={index}>
                            <ListItem
                                sx={{
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                    my: 2,
                                    boxShadow: 3,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center', // Center items vertically
                                    justifyContent: 'space-between', // Distribute space between items
                                    p: 2, // Add padding for better spacing
                                }}
                            >
                                {/* Rank */}
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    sx={{ minWidth: '30px', textAlign: 'center' }}
                                >
                                    {`${index + 1}`}
                                </Typography>

                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        badgeContent={
                                            index === 0 ? (
                                                <Box
                                                    component="img"
                                                    src={kingCrown}// Path to your crown image
                                                    alt="Crown"
                                                    sx={{
                                                    position: 'absolute',
                                                    top: -43, // Adjust as needed
                                                    right: 22, // Adjust as needed
                                                    width: 40, // Adjust size as needed
                                                    height: 40,
                                                    zIndex: 1, // Ensure it appears above the avatar
                                                }}
                                                />
                                            ) : null
                                        }
                                    >
                                        <Avatar
                                            src={entry.user.avatarImageUrl || defaultProfilePic}
                                            alt={entry.user.firstName}
                                            sx={{
                                                width: 86,
                                                height: 86,
                                                border: index === 0 ? '3px solid gold' : '1px solid black',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </Badge>
                                </ListItemAvatar>

                                {/* Name */}
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            sx={{ ml: 2 }} // Add margin to separate from the avatar
                                        >
                                            {entry.user.firstName} {entry.user.lastName}
                                        </Typography>
                                    }
                                    sx={{ flex: 1 }} // Take up available space for proper alignment
                                />

                                {/* Points */}
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    sx={{ ml: 2, whiteSpace: 'nowrap' }} // Prevent line breaks
                                >
                                    Poäng: {entry.points}
                                </Typography>
                            </ListItem>

                        </div>
                    ))}
                </List>
            </Box>
        </Box>
    );
}

export default TotalPoints;
