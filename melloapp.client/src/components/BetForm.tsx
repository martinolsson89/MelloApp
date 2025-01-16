import { useState, FormEvent, ReactNode } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Alert,
} from '@mui/material';
/*import Artists from './Artists';*/

// Define enums and types
enum ePlacement {
  Final = 'Final',
  FinalKval = 'FinalKval',
  ÅkerUt = 'ÅkerUt',
}

enum eFinalPlacement {
  Vinnare = 'Vinnare',
  Tvåa = 'Tvåa',
}

interface Artist {
  id: string;
  name: string;
  song: string;
  startingNumber: number;
  subCompetitionId: string;
}

interface SubCompetition {
  id: string;
  name: string;
  date: string;
  location: string;
  artists: Artist[];
}

interface Prediction {
  predictedPlacement: ePlacement | string;
  userId: string;
  artistId: string;
  subCompetitionId: string;
}

interface FinalPrediction {
  finalPredictedPlacement: eFinalPlacement | string;
  userId: string;
  artistId: string;
  subCompetitionId: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  hasMadeBet: boolean;
}

interface BetFormProps {
  subCompetitions: SubCompetition[];
  allArtists: Artist[];
  user: User;
  onBetSubmitted: () => void;
}

function BetForm({ subCompetitions, allArtists, user, onBetSubmitted }: BetFormProps) {
  const [predictions, setPredictions] = useState<{ [key: string]: ePlacement }>({});
  const [finalPredictions, setFinalPredictions] = useState<{
    [key in eFinalPlacement]?: string;
  }>({});
 const [errorMessage, setErrorMessage] = useState<ReactNode>('');

  const handlePredictionChange = (event: SelectChangeEvent<unknown>, artistId: string) => {
    setPredictions({
      ...predictions,
      [artistId]: event.target.value as ePlacement,
    });
  };

  const handleFinalPredictionChange = (
    event: SelectChangeEvent<unknown>,
    placement: eFinalPlacement
  ) => {
    setFinalPredictions({
      ...finalPredictions,
      [placement]: event.target.value as string,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Clear any existing error message
    setErrorMessage('');

    // Validation: Check predictions for each sub-competition
    for (const subCompetition of subCompetitions) {
      const artistIds = subCompetition.artists.map((artist) => artist.id);
      const subPredictions = artistIds.map((artistId) => predictions[artistId]);

      // Check if all predictions are made for this sub-competition
      if (subPredictions.some((placement) => !placement)) {
          setErrorMessage(
              <>
                  Du har missat att tippa en placering för varje artist i <strong>{subCompetition.name}</strong>.
              </>
          );
        return;
      }

      // Count the number of predictions for each placement
      const counts: { [key in ePlacement]: number } = {
        [ePlacement.Final]: 0,
        [ePlacement.FinalKval]: 0,
        [ePlacement.ÅkerUt]: 0,
      };

      subPredictions.forEach((placement) => {
        counts[placement]++;
      });

      // Validate counts
      if (
        counts[ePlacement.Final] !== 2 ||
        counts[ePlacement.FinalKval] !== 1 ||
        counts[ePlacement.ÅkerUt] !== 3
      ) {
          setErrorMessage(
              <>
                  I <strong>{subCompetition.name}</strong>, måste du välja <strong>2 artister</strong> till Final, <strong>1 artist</strong> till FinalKval, och <strong>3 artister</strong> som Åker Ut.
              </>
        );
        return;
        }

        const artistGoingOut = subCompetition.artists
            .filter((artist) => predictions[artist.id] === ePlacement.ÅkerUt)
            .map((artist) => artist.id);

        const winnerId = finalPredictions[eFinalPlacement.Vinnare];
        const secondplaceId = finalPredictions[eFinalPlacement.Tvåa];
        

              // Find the winner artist's details
      if (winnerId && artistGoingOut.includes(winnerId)) {
        const winnerArtist = subCompetition.artists.find((artist) => artist.id === winnerId);
        const winnerName = winnerArtist ? winnerArtist.name : 'Den valda artisten';

        setErrorMessage(
          <>
            Du kan inte tippa att <strong>{winnerName}</strong> åker ut i{' '}
            <strong>{subCompetition.name}</strong> men ändå vinner <strong>finalen</strong>?
          </>
        );
        return;
      }

      // Find the second place artist's details
      if (secondplaceId && artistGoingOut.includes(secondplaceId)) {
        const secondPlaceArtist = subCompetition.artists.find((artist) => artist.id === secondplaceId);
        const secondPlaceName = secondPlaceArtist ? secondPlaceArtist.name : 'Den valda artisten';

        setErrorMessage(
          <>
            Du kan inte tippa att <strong>{secondPlaceName}</strong> åker ut i{' '}
            <strong>{subCompetition.name}</strong> men ändå kommer tvåa i <strong>finalen</strong>?
          </>
        );
        return;
      }

    }

    // Validation for final predictions
    if (
      !finalPredictions[eFinalPlacement.Vinnare] ||
      !finalPredictions[eFinalPlacement.Tvåa]
    ) {
        setErrorMessage(
            <>
                Välj <strong>en</strong> artist som vinnare och en som kommer två i finalen
            </>
        );
      return;
    }

    if (
      finalPredictions[eFinalPlacement.Vinnare] === finalPredictions[eFinalPlacement.Tvåa]
    ) {
        setErrorMessage(
            <>
                <strong>Vinnaren</strong> och <strong>tvåan</strong> i finalen kan inte vara <strong>samma</strong> artist.
            </>
        );
      return;
      }


    const userId = user.id;

    // Prepare payloads for predictions and final predictions
    const predictionPayload: { predictions: Prediction[] } = {
      predictions: Object.keys(predictions).map((artistId) => ({
        predictedPlacement: predictions[artistId] as string, // Ensure enum is serialized as string
        userId: userId,
        artistId: artistId,
        subCompetitionId:
          subCompetitions.find((sub) =>
            sub.artists.some((artist) => artist.id === artistId)
          )?.id || '',
      })),
    };

    const finalPredictionPayload: { predictions: FinalPrediction[] } = {
      predictions: Object.keys(finalPredictions).map((placement) => {
        const artistId = finalPredictions[placement as eFinalPlacement];
        const subCompetitionId =
          allArtists.find((artist) => artist.id === artistId)?.subCompetitionId || '';

        return {
          finalPredictedPlacement: placement as string, // Ensure enum is serialized as string
          userId: userId,
          artistId: artistId!,
          subCompetitionId: subCompetitionId,
        };
      }),
    };

    try {
      // Submit regular predictions
      const predictionResponse = await fetch('/Prediction/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionPayload),
      });

      // Submit final predictions
      const finalPredictionResponse = await fetch('/FinalPrediction/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalPredictionPayload),
      });

      if (predictionResponse.ok && finalPredictionResponse.ok) {
        // Update HasMadeBet in backend
        const updateBetResponse = await fetch('/Account/updateBet', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ hasMadeBet: true }),
        });
        if (updateBetResponse.ok) {
          alert('Ditt tips är nu registrerat!');
          setPredictions({});
          setFinalPredictions({});
          onBetSubmitted(); // Correct reference
        } else {
          throw new Error('Misslyckades att uppdatera tips status');
        }
      } else {
        throw new Error('Misslyckades att skicka tips');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Ett problem uppstod när ditt tips skulle skickas in. Testa igen eller kontakta tävlingsledningen.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {subCompetitions.map((subCompetition) => (
          <Card key={subCompetition.id} sx={{ mb: 4 }}>
            <CardHeader
              title={subCompetition.name}
              subheader={`${new Date(subCompetition.date).toISOString().replace('T', ' ').slice(0, 11)} - ${subCompetition.location}`}
            />
            <CardContent>
              <Typography variant="h6">Bidrag:</Typography>
              <List>
                {subCompetition.artists.map((artist) => (
                  <div key={artist.id}>
                    <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                      <ListItemText
                        primary={`${artist.startingNumber}. ${artist.song}`}
                        secondary={`Artist: ${artist.name}`}
                      />
                      <Select
                        value={predictions[artist.id] || ''}
                        onChange={(e) => handlePredictionChange(e, artist.id)}
                        displayEmpty
                        sx={{
                          ml: 2,
                          width: 150,
                          bgcolor: predictions[artist.id]
                            ? 'inherit'
                            : 'rgba(255, 0, 0, 0.1)',
                        }}
                      >
                        <MenuItem value="">
                          <em>Placering</em>
                        </MenuItem>
                        <MenuItem value={ePlacement.Final}>Final</MenuItem>
                        <MenuItem value={ePlacement.FinalKval}>FinalKval</MenuItem>
                        <MenuItem value={ePlacement.ÅkerUt}>Åker Ut</MenuItem>
                      </Select>
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}

        {/* Card for Winner Prediction */}
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Vinnare i finalen" />
          <CardContent>
            <Select
              value={finalPredictions[eFinalPlacement.Vinnare] || ''}
              onChange={(e) => handleFinalPredictionChange(e, eFinalPlacement.Vinnare)}
              displayEmpty
              sx={{ width: '100%' }}
            >
              <MenuItem value="">
                <em>Välj artist</em>
              </MenuItem>
              {allArtists.map((artist) => (
                <MenuItem key={artist.id} value={artist.id}>
                  {artist.name} - {artist.song}
                </MenuItem>
              ))}
            </Select>
          </CardContent>
        </Card>

        {/* Card for Runner-up Prediction */}
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Tvåa i finalen" />
          <CardContent>
            <Select
              value={finalPredictions[eFinalPlacement.Tvåa] || ''}
              onChange={(e) => handleFinalPredictionChange(e, eFinalPlacement.Tvåa)}
              displayEmpty
              sx={{ width: '100%' }}
            >
              <MenuItem value="">
                <em>Välj artist</em>
              </MenuItem>
              {allArtists.map((artist) => (
                <MenuItem key={artist.id} value={artist.id}>
                  {artist.name} - {artist.song}
                </MenuItem>
              ))}
            </Select>
          </CardContent>
        </Card>
        {/* Display error message if any */}
        {errorMessage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        )}
        <Button type="submit" variant="contained" color="primary">
          Skicka in tips
        </Button>
      </form>
    </>
  );
}

export default BetForm;
