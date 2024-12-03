import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Navbar from '../components/Navbar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { userService } from '../services/UserService';
import SubCompetitions from '../components/SubCompetitions';

interface GetSubCompetitionWithArtistsAndPredictionsDto {
  id: string;
  name: string;
  date: string;
  location: string;
  artists: Artist[];
}

interface Artist {
  id: string;
  name: string;
  song: string;
  startingNumber: number;
  predictions: Prediction[];
  placement?: string; // Added optional placement property
  finalPlacement?: string; // Added optional finalPlacement property

}

interface Prediction {
  id: string;
  predictedPlacement: string;
  user: User;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatarImageUrl: string;
  hasMadeBet: boolean;
}

interface FinalPrediction {
  id: string;
  finalPredictedPlacement: string;
  userId: string;
  artistId: string;
  subcompetitionId: string;
}

interface ResultOfSubCompetition {
  id: string;
  placement: string;
  finalPlacement: string;
  artistId: string;
  subCompetitionId: string;
}

function BetOverview() {
  const [betOverviewData, setBetOverviewData] = useState<GetSubCompetitionWithArtistsAndPredictionsDto[]>([]);
  const [finalPredictionData, setFinalPredictionData] = useState<FinalPrediction[]>([]);
  const [resultsData, setResultsData] = useState<ResultOfSubCompetition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = userService.isLoggedIn();

  const colors = ["#6ea1d9", "#764598", "#c63a8d", "#d46444", "#e0a544"];

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await fetch('/SubCompetition/GetSubCompetitionsWithArtistsAndPredictions');
        if (response.status === 200) {
          let data = await response.json();
          console.log('API Data:', data); // Inspect data
          setBetOverviewData(data);
        } else {
          throw new Error('Error fetching data');
        }
      } catch (error) {
        console.error(error);
        setError('Kunde inte hämta tips-data');
      }
    }

    async function fetchFinalPrediction() {
      try {
        let response = await fetch('/FinalPrediction');
        if (response.status === 200) {
          let data = await response.json();
          console.log('API Data FinalPrediction:', data);
          setFinalPredictionData(data);
        } else {
          throw new Error('Error fetching data');
        }
      } catch (error) {
        console.error(error);
        setError('Kunde inte hämta tips-data');
      }
    }

    async function fetchResultsData() {
      try {
        let response = await fetch('/ResultOfSubCompetition');
        if (response.status === 200) {
          let data = await response.json();
          console.log('API Data Results:', data);
          setResultsData(data);
        } else {
          throw new Error('Error fetching results data');
        }
      } catch (error) {
        console.error(error);
        setError('Kunde inte hämta resultatsdata');
      }
    }

    setIsLoading(true);
    Promise.all([fetchData(), fetchFinalPrediction(), fetchResultsData()])
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError('Kunde inte hämta data');
        setIsLoading(false);
      });
  }, []);

  // Create a mapping of artistId to result
  const artistResultsMap: { [artistId: string]: ResultOfSubCompetition } = {};
  resultsData.forEach((result) => {
    artistResultsMap[result.artistId] = result;
  });

  // Filter users who have made bets and sort artists by startingNumber
  const filteredBetOverviewData = betOverviewData.map((subComp) => ({
    ...subComp,
    artists:
      subComp.artists
        ?.map((artist) => ({
          ...artist,
          predictions: artist.predictions?.filter((prediction) => prediction.user.hasMadeBet) || [],
          placement: artistResultsMap[artist.id]?.placement, // Add placement if available
          finalPlacement: artistResultsMap[artist.id]?.finalPlacement, // Add finalPlacement if available

        }))
        .sort((a, b) => a.startingNumber - b.startingNumber) || [],
  }));

  const placementDisplayName = (placement: string) => {
    switch (placement) {
      case 'Final':
        return 'Final';
      case 'FinalKval':
        return 'Finalkval';
      case 'ÅkerUt':
        return 'Åker Ut';
      default:
        return 'Oklar placering';
    }
  };

  const finalPlacementDisplayName = (finalPlacement: string) => {
    switch (finalPlacement) {
      case 'Vinnare':
        return 'Vinnare i finalen';
      case 'Tvåa':
        return '2a i finalen';
      default:
        return 'Oklar placering';
    }
  };

  // Create a mapping of userId to User
  const userMap: { [key: string]: User } = {};
  betOverviewData.forEach((subComp) => {
    subComp.artists.forEach((artist) => {
      artist.predictions.forEach((prediction) => {
        userMap[prediction.user.id] = prediction.user;
      });
    });
  });

  // Create a mapping of artistId to Artist
  const artistMap: { [key: string]: Artist } = {};
  filteredBetOverviewData.forEach((subComp) => {
    subComp.artists.forEach((artist) => {
      artistMap[artist.id] = artist;
    });
  });

  // Group final predictions by artistId
  const finalPredictionsByArtist = finalPredictionData.reduce((acc, finalPrediction) => {
    const artistId = finalPrediction.artistId;
    if (!acc[artistId]) {
      acc[artistId] = {
        artist: artistMap[artistId],
        predictions: [],
      };
    }
    const user = userMap[finalPrediction.userId];
    if (user) {
      acc[artistId].predictions.push({
        finalPredictedPlacement: finalPrediction.finalPredictedPlacement,
        user: user,
      });
    }
    return acc;
  }, {} as {
    [artistId: string]: {
      artist: Artist;
      predictions: Array<{ finalPredictedPlacement: string; user: User }>;
    };
  });

  // Convert the object to an array for easy mapping
  const finalPredictionsArray = Object.values(finalPredictionsByArtist);

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
          <Box
            sx={{
              mt: 4,
              textAlign: 'left',
              mx: 'auto',
              p: { xs: 2, md: 3 },
              boxShadow: 3,
              borderRadius: 2,
              bgcolor: '#f9f9f9',
              maxWidth: 1200,
            }}
          >
            <Typography variant="h4" fontWeight='bold' gutterBottom align="center">
              Tipshörnan
            </Typography>
            <Typography variant="body1" align="center">
              Här kan du se hur släkten har tippat i Mello. Tryck på deltävlingen för att se mer detaljer.
            </Typography>
            <Divider sx={{ my: 3 }} />

            {/* Display each subcompetition in its own collapsible Accordion */}
            {filteredBetOverviewData.map((subComp, index) => (
              <Accordion key={subComp.id} sx={{ mb: 3, backgroundColor:'lightgray' }}>
                {/* Accordion Summary */}
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${subComp.id}-content`}
                  id={`panel-${subComp.id}-header`}
                  sx={{backgroundColor: colors[index], boxShadow: 2, p: 2, textAlign: 'center', borderTopLeftRadius: 6, borderTopRightRadius: 6 }}
                >
                  <Typography variant="h5" color='white' fontWeight='bold' sx={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
                    {subComp.name}: {`${new Date(subComp.date)
                                    .toISOString()
                                    .replace('T', ' ')
                                    .slice(0, 11)} 20:00 - ${subComp.location}`}
                                    
                  </Typography>
                </AccordionSummary>

                {/* Accordion Details */}
                <AccordionDetails>
                  <Divider sx={{ my: 2 }} />
                  {/* Artists displayed horizontally using Grid */}
                  <Grid container spacing={3}>
                    {subComp.artists?.map((artist) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={artist.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h6" gutterBottom>
                                {artist.startingNumber}. {artist.song}
                              </Typography>
                              <Typography variant="subtitle1" gutterBottom>
                                "{artist.name}"
                              </Typography>

                              {/* Display placement if available */}
                              {artist.placement !== undefined && (
                                <Chip
                                  label={`Resultat: ${placementDisplayName(artist.placement)}`}
                                  color="primary"
                                  variant="outlined"
                                  sx={{ mt: 1 }}
                                />
                              )}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" gutterBottom>
                              Användarprediktioner:
                            </Typography>
                            <List dense>
                              {artist.predictions?.map((prediction, index) => {
                                const isCorrect =
                                  artist.placement !== undefined &&
                                  artist.placement === prediction.predictedPlacement;
                                return (
                                  <ListItem
                                    key={index}
                                    alignItems="flex-start"
                                    sx={{
                                      backgroundColor: isCorrect ? '#e8f5e9' : index % 2 === 0 ? '#f2f3f5' : 'white',
                                      borderRadius: 2,
                                      mb: 1,
                                      transition: 'background-color 0.3s',
                                      '&:hover': {
                                        backgroundColor: isCorrect ? '#c8e6c9' : '#e0e0e0',
                                      },
                                    }}
                                  >
                                    <ListItemAvatar>
                                      <Avatar
                                        src={prediction.user.avatarImageUrl}
                                        alt={`${prediction.user.firstName} ${prediction.user.lastName}`}
                                      />
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Box display="flex" alignItems="center">
                                          <Typography
                                            variant="body1"
                                            sx={{ fontWeight: isCorrect ? 'bold' : 'normal' }}
                                          >
                                            {`${prediction.user.firstName} ${prediction.user.lastName}`}
                                          </Typography>
                                          {isCorrect && (
                                            <CheckCircleIcon color="success" sx={{ ml: 1 }} />
                                          )}
                                        </Box>
                                      }
                                      secondary={
                                        <Typography
                                          variant="body2"
                                          sx={{ fontWeight: isCorrect ? 'bold' : 'normal' }}
                                        >
                                          Tippat: {placementDisplayName(prediction.predictedPlacement)}
                                        </Typography>
                                      }
                                    />
                                  </ListItem>
                                );
                              })}
                            </List>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}

            {/* Display Final Predictions */}
            <Accordion sx={{ mb: 3, backgroundColor: 'lightgray' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-final-content`}
                id={`panel-final-header`}
                sx={{backgroundColor: 'green', boxShadow: 2, p: 2, textAlign: 'center'}}

              >
              <Typography variant="h5" fontWeight='bold' color='white' >Final: 2025-03-08 20:00 - Stockholm</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Divider sx={{ my: 2}} />
                {finalPredictionsArray.length > 0 ? (
                  <Grid container spacing={3}>
                    {finalPredictionsArray.map((group) => {
                      const { artist, predictions } = group;

                      if (!artist) {
                        // Skip if artist not found
                        return null;
                      }

                      return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={artist.id}>
                          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                  {artist.name}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                  "{artist.song}"
                                </Typography>
                                {/* Display final placement if available */}
                                {artist.finalPlacement && (
                                  <Chip
                                    label={`Resultat i finalen: ${finalPlacementDisplayName(artist.finalPlacement)}`}
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ mt: 1 }}
                                  />
                                )}
                              </Box>
                              <Divider sx={{ my: 2}} />
                              <Typography variant="subtitle2" gutterBottom>
                                Användartips:
                              </Typography>
                              <List dense>
                                {predictions.map((prediction, index) => {
                                  const isCorrect =
                                    artist.finalPlacement !== undefined &&
                                    artist.finalPlacement === prediction.finalPredictedPlacement;
                                  return (
                                    <ListItem
                                      key={index}
                                      alignItems="flex-start"
                                      sx={{
                                        backgroundColor: isCorrect ? '#e8f5e9' : index % 2 === 0 ? '#f2f3f5' : 'white',
                                        borderRadius: 2,
                                        mb: 1,
                                        transition: 'background-color 0.3s',
                                        '&:hover': {
                                          backgroundColor: isCorrect ? '#c8e6c9' : '#e0e0e0',
                                        },
                                      }}
                                    >
                                      <ListItemAvatar>
                                        <Avatar
                                          src={prediction.user.avatarImageUrl}
                                          alt={`${prediction.user.firstName} ${prediction.user.lastName}`}
                                        />
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary={
                                          <Box display="flex" alignItems="center">
                                            <Typography
                                              variant="body1"
                                              sx={{ fontWeight: isCorrect ? 'bold' : 'normal' }}
                                            >
                                              {`${prediction.user.firstName} ${prediction.user.lastName}`}
                                            </Typography>
                                            {isCorrect && (
                                              <CheckCircleIcon color="success" sx={{ ml: 1 }} />
                                            )}
                                          </Box>
                                        }
                                        secondary={
                                          <Typography
                                            variant="body2"
                                            sx={{ fontWeight: isCorrect ? 'bold' : 'normal' }}
                                          >
                                            Tippat: {prediction.finalPredictedPlacement}
                                          </Typography>
                                        }
                                      />
                                    </ListItem>
                                  );
                                })}
                              </List>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : (
                  <Typography variant="body1">Inga finaltips tillgängliga.</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </>
    )
  );
};

export default BetOverview;
