// PredictionListItem.jsx
import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import defaultProfilePic from './path/to/defaultProfilePic.png'; // Update path

const PredictionListItem = ({ prediction, isCorrect, isFinal }) => {
  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        backgroundColor: prediction.index % 2 === 0 ? '#f2f3f5' : 'white',
        borderRadius: 2,
        mb: 1,
        boxShadow: isCorrect ? 2 : 0,
        border: isCorrect ? '1px solid gold' : 'none',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: isCorrect ? 4 : 1,
        },
      }}
    >
      <ListItemAvatar>
        <Avatar
          src={prediction.user.avatarImageUrl || defaultProfilePic}
          alt={`${prediction.user.firstName} ${prediction.user.lastName}`}
          sx={{
            border: isFinal && isCorrect ? '2px solid #4caf50' : 'none',
          }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: isCorrect ? 'bold' : 'normal' }}>
              {`${prediction.user.firstName} ${prediction.user.lastName}`}
            </Typography>
            {isCorrect && (
              <Tooltip title="Rätt tipp">
                <CheckCircleIcon sx={{ color: 'gold', ml: 1 }} />
              </Tooltip>
            )}
          </Box>
        }
        secondary={
          isCorrect ? (
            <Typography variant="body2" color="text.secondary">
              Tippat: <Typography component="span" sx={{ fontWeight: 'bold' }}>{placementDisplayName(prediction.predictedPlacement)}</Typography>
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Tippat: {placementDisplayName(prediction.predictedPlacement)}
            </Typography>
          )
        }
      />
    </ListItem>
  );
};

export default PredictionListItem;
