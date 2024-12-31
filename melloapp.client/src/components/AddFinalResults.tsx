import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {userService} from '../services/UserService';

interface Artist {
    id: string;
    name: string;
    song: string;
    startingNumber: number;
}

function AddFinalResults() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedWinnerId, setSelectedWinnerId] = useState<string>('');
    const [selectedSecondId, setSelectedSecondId] = useState<string>('');
    const [artistLoading, setArtistLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const IsAdmin = userService.isAdmin();

    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    // Fetch sub-competitions on component mount
    useEffect(() => {
        setArtistLoading(true);
        fetch('/Artists')
            .then((response) => {
                if (response.ok) return response.json();
                throw new Error('Failed to fetch sub-competitions');
            })
            .then((data) => {
                setArtists(data);
                setArtistLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setError('Kunde inte hämta deltävlingar.');
                setArtistLoading(false);
            });
    }, []);

    const handleSave = async () => {
        if (!selectedWinnerId || !selectedSecondId) {
          alert('Please select both the winner and the second place.');
          return;
        }

        const data = [
            {
                "artistId": selectedWinnerId,
                "finalPlacement": "Vinnare"
            },
            {
                "artistId": selectedSecondId,
                "finalPlacement": "Tvåa"
            }
        ];
          console.log(data);

          try {
              const response = await fetch('https://app-melloapp-001.azurewebsites.net/ResultOfSubCompetition/batch', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify(data)
            });
      
            if (response.ok) {
              const result = await response.json();
              console.log('Results saved successfully:', result);
              alert('Results saved successfully.');
            } else {
              const errorData = await response.json();
              console.error('Error saving results:', errorData);
              alert('Error saving results.');
            }
          } catch (error) {
            console.error('Network error:', error);
            alert('Network error occurred.');
          }
        };


    return (
        IsAdmin && (
        <>
            <Navbar />
            <Box
                sx={{
                    mt: 4,
                    textAlign: 'center',
                    mx: 'auto',
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: 'white',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Lägg till resultat för deltävling
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {artistLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="winner-select-label">Välj Vinnare i finalen</InputLabel>
                            <Select
                                labelId="winner-select-label"
                                value={selectedWinnerId}
                                label="Välj artist"
                                onChange={(e) => setSelectedWinnerId(e.target.value as string)}
                            >
                                {artists.map((artist) => (
                                    <MenuItem key={artist.id} value={artist.id}>
                                        {artist.name}: {artist.song}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="second-select-label">Välj Tvåa i finalen</InputLabel>
                            <Select
                                labelId="second-select-label"
                                value={selectedSecondId}
                                label="Välj artist"
                                onChange={(e) => setSelectedSecondId(e.target.value as string)}
                            >
                                {artists.map((artist) => (
                                    <MenuItem key={artist.id} value={artist.id}>
                                        {artist.name}: {artist.song}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            sx={{m:2}}
                        >
                            Save Results
                        </Button>
                        <Button variant="contained" color="secondary" sx={{ m: 2 }} onClick={() => handleNavigation('/admin-center')}>
                            Go Back
                        </Button>
                    </>
                )}
            </Box>
        </>
        )
    )
}

export default AddFinalResults