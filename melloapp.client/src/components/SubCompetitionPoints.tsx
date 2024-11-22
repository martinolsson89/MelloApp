import { Typography, Box, List, ListItem, ListItemText, Divider, Avatar, ListItemAvatar } from '@mui/material';
import defaultProfilePic from '../assets/avatar/anonymous-user.webp';

interface SubCompetitionProps {
  subCompetitionData: SubCompetitionWithScoresDto[];
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

function SubCompetitionPoints({ subCompetitionData }: SubCompetitionProps) {

  return (
    <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row', lg: 'row'},
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        gap: 2, // Adds space between the cards
    }}>
      {subCompetitionData.map((entry) => (
        <Box
          key={entry.subCompetitionId}
          sx={{
            mt: 4,
            textAlign: 'left',
            mx: 'auto',
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            width: { xs: '92%', sm: '92%', md:'auto' },
          }}
        >
          <Typography variant="h6" gutterBottom>
            Poäng {entry.name}
          </Typography>
          <Divider />

          <List>
            {entry.userScores.map((userScore, index) => (
              <div key={userScore.userId}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      src={userScore.avatarImageUrl || defaultProfilePic}
                      alt={userScore.firstName}
                      sx={{ width: 45, height: 45, m: 1 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${index + 1}. ${userScore.firstName}`}
                    secondary={
                      <Typography variant="body2" fontWeight="bold">
                        Poäng: {userScore.points}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
}

export default SubCompetitionPoints;
