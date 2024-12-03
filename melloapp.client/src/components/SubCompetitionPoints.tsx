import { Typography, Box, List, ListItem, ListItemText, Avatar, ListItemAvatar } from '@mui/material';

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

  const colors = ["#6ea1d9", "#764598", "#c63a8d", "#d46444", "#e0a544"];


  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row', lg: 'row' },
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      gap: 2, // Adds space between the cards
    }}>
      {subCompetitionData.map((entry, index) => (
        <Box
          key={index}
          sx={{
            mt: 4,
            textAlign: 'left',
            mx: 'auto',
            // p: 3,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: 'white',
            width: { xs: '92%', sm: '92%', md: 'auto' },
          }}
        >
          <Box sx={{ backgroundColor: colors[index], boxShadow: 2, p: 2, textAlign: 'center', borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
            <Typography variant="h6" color='white' gutterBottom sx={{
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", // Add shadow here
            }} >
              Poäng {entry.name}
            </Typography>
          </Box>
          <List>
            {entry.userScores.map((userScore, index) => (
              <div key={index}>
                <ListItem sx={{
                  backgroundColor: index % 2 === 0 ? 'white' : '#f2f3f5',
                  borderRadius: 2,
                }}>
                  <ListItemAvatar>
                    <Avatar
                      src={userScore.avatarImageUrl}
                      alt={userScore.firstName}
                      sx={{ width: 55, height: 55, m: 1 }}
                    />
                  </ListItemAvatar>
                  {userScore.firstName.toLowerCase() === "frida" ? (
                    <ListItemText
                    primary={`${index + 1}. ${userScore.firstName} ${userScore.lastName.charAt(0).toUpperCase()}`}
                    secondary={
                      <Typography variant="body2" fontWeight="bold">
                        Poäng: {userScore.points}
                      </Typography>
                    }
                  />
                  ) : (
                    <ListItemText
                    primary={`${index + 1}. ${userScore.firstName}`}
                    secondary={
                      <Typography variant="body2" fontWeight="bold">
                        Poäng: {userScore.points}
                      </Typography>
                    }
                  />
                  )}
                </ListItem>
              </div>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
}

export default SubCompetitionPoints;
