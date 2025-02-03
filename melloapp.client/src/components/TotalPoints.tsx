import { Typography, Box, List, ListItem, ListItemText, Avatar, ListItemAvatar, Badge } from '@mui/material';
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
    avatarImageUrl: string;
    hasMadeBet: boolean;
}

function TotalPoints({ leaderboardData }: LeaderboardProps) {
    // Filter out users who haven't made bets
    const filteredLeaderboardData = leaderboardData.filter((entry) => entry.user.hasMadeBet);

    // Sort so the top scorer is first
    filteredLeaderboardData.sort((a, b) => b.points - a.points);

    // Determine the leader's points (all entries with these points get crowned)
    const leaderPoints = filteredLeaderboardData.length > 0 ? filteredLeaderboardData[0].points : 0;

    // Calculate leader difference (will be 0 if the top two are tied)
    const secondPlacePoints = filteredLeaderboardData.length > 1 ? filteredLeaderboardData[1].points : 0;
    const leaderDifference = leaderPoints - secondPlacePoints;

    // Compute the ranking with ties. If two users share the same score,
    // they get the same rank and the next rank is simply the count of distinct scores + 1.
    let currentRank = 0;
    let previousPoints: number | null = null;
    const leaderboardWithRank = filteredLeaderboardData.map((entry, index) => {
        if (index === 0) {
            currentRank = 1;
        } else {
            if (entry.points === previousPoints) {
                // same rank as previous
            } else {
                // Increase rank by 1 (only count distinct scores)
                currentRank++;
            }
        }
        previousPoints = entry.points;
        return { entry, rank: currentRank };
    });

    return (
        <Box
            sx={{
                mt: 4,
                textAlign: 'left',
                mx: 'auto',
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
            <Box sx={{ px: 3 }}>
                <List>
                    {leaderboardWithRank.map(({ entry, rank }, index) => {
                        // Calculate difference text. Hide if no difference.
                        let differenceText = '';
                        let differenceColor: string | undefined = undefined;
                        if (index === 0 && filteredLeaderboardData.length > 1) {
                            if (leaderDifference > 0) {
                                differenceText = `(+${leaderDifference})`;
                                differenceColor = 'green';
                            }
                        } else if (index > 0) {
                            const diff = leaderPoints - entry.points;
                            if (diff > 0) {
                                differenceText = `(-${diff})`;
                                differenceColor = 'red';
                            }
                        }

                        return (
                            <div key={entry.id}>
                                <ListItem
                                    sx={{
                                        backgroundColor: 'white',
                                        borderRadius: 2,
                                        my: 2,
                                        boxShadow: 3,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        p: 2,
                                    }}
                                >
                                    {/* Rank */}
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        sx={{ minWidth: '30px', textAlign: 'center' }}
                                    >
                                        {rank}
                                    </Typography>

                                    <ListItemAvatar>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            badgeContent={
                                                // Give a crown to any entry that ties for first.
                                                entry.points === leaderPoints ? (
                                                    <Box
                                                        component="img"
                                                        src={kingCrown}
                                                        alt="Crown"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: -43,
                                                            right: 22,
                                                            width: 40,
                                                            height: 40,
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                ) : null
                                            }
                                        >
                                            <Avatar
                                                src={entry.user.avatarImageUrl}
                                                alt={entry.user.firstName}
                                                sx={{
                                                    width: 86,
                                                    height: 86,
                                                    border: entry.points === leaderPoints ? '3px solid gold' : '1px solid black',
                                                    boxSizing: 'border-box',
                                                }}
                                            />
                                        </Badge>
                                    </ListItemAvatar>

                                    {/* Name */}
                                    {entry.user.firstName.toLowerCase() === 'frida' ? (
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" fontWeight="bold" sx={{ ml: 2 }}>
                                                    {entry.user.firstName} {entry.user.lastName.charAt(0).toUpperCase()}
                                                </Typography>
                                            }
                                            sx={{ flex: 1 }}
                                        />
                                    ) : (
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" fontWeight="bold" sx={{ ml: 2 }}>
                                                    {entry.user.firstName}
                                                </Typography>
                                            }
                                            sx={{ flex: 1 }}
                                        />
                                    )}

                                    {/* Points and Difference */}
                                    <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <Typography variant="body1" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
                                            Poäng: {entry.points}
                                        </Typography>
                                        {differenceText && (
                                            <Typography variant="caption" sx={{ color: differenceColor }}>
                                                {differenceText}
                                            </Typography>
                                        )}
                                    </Box>
                                </ListItem>
                            </div>
                        );
                    })}
                </List>
            </Box>
        </Box>
    );
}

export default TotalPoints;
