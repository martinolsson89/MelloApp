// AddSubCompetitionResults.tsx

import React, { useState, useEffect } from 'react';
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
import { userService } from '../services/UserService';


enum ePlacement {
    Final = 'Final',
    FinalKval = 'FinalKval',
    ÅkerUt = 'ÅkerUt',
}
interface SubCompetition {
    id: string;
    name: string;
    date: string;
    location: string;
}

interface Artist {
    id: string;
    name: string;
    song: string;
    startingNumber: number;
    subCompetitionId: string;
}

interface PlacementOption {
    value: string;
    label: string;
}

const AddSubCompetitionResults: React.FC = () => {
    const [subCompetitions, setSubCompetitions] = useState<SubCompetition[]>([]);
    const [selectedSubCompetitionId, setSelectedSubCompetitionId] = useState<string>('');
    const [artists, setArtists] = useState<Artist[]>([]);
    const [placements, setPlacements] = useState<{ [artistId: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [subCompLoading, setSubCompLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const IsAdmin = userService.isAdmin();


    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    // Fetch sub-competitions on component mount
    useEffect(() => {
        setSubCompLoading(true);
        fetch('/SubCompetition')
            .then((response) => {
                if (response.ok) return response.json();
                throw new Error('Failed to fetch sub-competitions');
            })
            .then((data) => {
                setSubCompetitions(data);
                setSubCompLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setError('Kunde inte hämta deltävlingar.');
                setSubCompLoading(false);
            });
    }, []);

    // Fetch artists when a sub-competition is selected
    useEffect(() => {
        if (selectedSubCompetitionId) {
            setLoading(true);
            fetch(`/SubCompetition/GetSubCompetitionWithArtists/${selectedSubCompetitionId}`)
                .then((response) => {
                    if (response.ok) return response.json();
                    throw new Error('Failed to fetch artists');
                })
                .then((data) => {
                    const artistsData: Artist[] = data.artists || [];
                    setArtists(artistsData);

                    // Initialize placements with empty strings
                    const initialPlacements: { [artistId: string]: string } = {};
                    artistsData.forEach((artist: Artist) => {
                        initialPlacements[artist.id] = '';
                    });
                    setPlacements(initialPlacements);

                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setError('Kunde inte hämta artister.');
                    setLoading(false);
                });
        } else {
            setArtists([]);
            setPlacements({});
        }
    }, [selectedSubCompetitionId]);

    // Handle placement input changes
    const handlePlacementChange = (artistId: string, value: string) => {
        setPlacements((prevPlacements) => ({
            ...prevPlacements,
            [artistId]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = () => {
        // Validate that all placements have been filled
        const incompletePlacements = Object.values(placements).some((placement) => placement === '');
        if (incompletePlacements) {
            alert('Vänligen fyll i placeringar för alla artister.');
            return;
        }

        // Prepare the results array
        const results = Object.entries(placements).map(([artistId, placement]) => ({
            placement,
            artistId,
            subCompetitionId: selectedSubCompetitionId,
        }));

        // Count the number of predictions for each placement
        const counts: { [key in ePlacement]: number } = {
            [ePlacement.Final]: 0,
            [ePlacement.FinalKval]: 0,
            [ePlacement.ÅkerUt]: 0,
        };

        results.forEach((result) => {
            counts[result.placement as ePlacement] += 1;
        });

        // Validate counts
        if (
            counts[ePlacement.Final] !== 2 ||
            counts[ePlacement.FinalKval] !== 2 ||
            counts[ePlacement.ÅkerUt] !== 2
        ) {
            alert('Du måste ha fylla i två resultat av varje typ.(Final, FinalKval, Åker ut)');
            return;
        }

        setLoading(true);

        fetch('/ResultOfSubCompetition/Batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies in the request if needed
            body: JSON.stringify({ results }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Resultat skickades in framgångsrikt!');
                    // Optionally reset the form or navigate away
                } else {
                    throw new Error('Failed to submit results');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error submitting results:', error);
                alert('Kunde inte skicka in resultat.');
                setLoading(false);
            });
    };

    // Define placement options
    const placementOptions: PlacementOption[] = [
        { value: 'Final', label: 'Final' },
        { value: 'FinalKval', label: 'Finalkval' },
        { value: 'ÅkerUt', label: 'Åker Ut' },
    ];

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

                    {subCompLoading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="subcompetition-select-label">Välj deltävling</InputLabel>
                                <Select
                                    labelId="subcompetition-select-label"
                                    value={selectedSubCompetitionId}
                                    label="Välj deltävling"
                                    onChange={(e) => setSelectedSubCompetitionId(e.target.value as string)}
                                >
                                    {subCompetitions.map((subComp) => (
                                        <MenuItem key={subComp.id} value={subComp.id}>
                                            {subComp.name}: {new Date(subComp.date)
                                                .toISOString()
                                                .replace('T', ' ')
                                                .slice(0, 11)} - {subComp.location}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button variant="contained" color="secondary" sx={{ mb: 2 }} onClick={() => handleNavigation('/admin-center')}>
                                Go Back
                            </Button>
                        </>
                    )}

                    {loading ? (
                        <Box sx={{ mt: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : artists.length > 0 ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Ange resultat för artister
                            </Typography>
                            {artists.map((artist) => (
                                <Box key={artist.id} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1">
                                        {artist.startingNumber}. {artist.name} - "{artist.song}"
                                    </Typography>
                                    <FormControl fullWidth sx={{ mt: 1 }}>
                                        <InputLabel id={`placement-select-label-${artist.id}`}>Resultat</InputLabel>
                                        <Select
                                            labelId={`placement-select-label-${artist.id}`}
                                            value={placements[artist.id] !== undefined ? placements[artist.id] : ''}
                                            label="Resultat"
                                            onChange={(e) => handlePlacementChange(artist.id, e.target.value as string)}
                                        >
                                            {placementOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            ))}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{ mt: 2 }}
                            >
                                Skicka in resultat
                            </Button>
                        </>
                    ) : (
                        selectedSubCompetitionId && (
                            <Typography variant="body1">
                                Inga artister tillgängliga för denna deltävling.
                            </Typography>
                        )
                    )}
                </Box>
            </>
        )
    );
};

export default AddSubCompetitionResults;
