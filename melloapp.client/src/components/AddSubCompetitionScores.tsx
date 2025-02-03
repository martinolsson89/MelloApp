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
    SelectChangeEvent,
    Avatar,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { userService } from '../services/UserService';


interface SubCompetition {
    id: string;
    name: string;
    date: string;
    location: string;
}

interface Users {
    id: string;
    firstName: string;
    lastName: string;
    avatarImageUrl: string;
    points: number;
}


function AddSubCompetitionScores() {
    const [subCompetitions, setSubCompetitions] = useState<SubCompetition[]>([]);
    const [subCompLoading, setSubCompLoading] = useState<boolean>(false);
    const [selectedSubCompetitionId, setSelectedSubCompetitionId] = useState<string>('');
    const [showButton, setShowButton] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const [userPoints, setUserPoints] = useState<Users[]>([]);

    const IsAdmin = userService.isAdmin();


    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleOnChange = (e: SelectChangeEvent<string>) => {
        const selectedId = e.target.value;
        setSelectedSubCompetitionId(selectedId);
        console.log('Selected SubCompetition ID:', selectedId);
        setShowButton(true);
    }

    const handleSubmit = () => {
        fetch(`https://www.slaktkampen.se/Points/${selectedSubCompetitionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(selectedSubCompetitionId),
        })
            .then(async (response) => {
                if (response.ok) {
                    const addedScores: Users[] = await response.json(); // Parse the returned JSON into the interface
                    setUserPoints(addedScores); // Update the state with the new scores
                    alert('Poängen beräknades och lades till framgångsrikt!');
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to submit results');
                }
            })
            .catch((error) => {
                console.error('Error submitting results:', error);
                alert(`Kunde inte skicka in resultat. Fel: ${error.message}`);
            });

        fetch('/Users')
    }



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
                        Lägg till poäng efter deltävling
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
                                    onChange={handleOnChange}
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
                            <Button variant="contained" color="secondary" onClick={() => handleNavigation('/admin-center')}>
                                Go Back
                            </Button>
                        </>
                    )}
                    {showButton && (
                        <Button variant="contained" sx={{ mx: 2 }} onClick={() => handleSubmit()}>Beräkna & lägg till poäng</Button>

                    )}
                    {userPoints && (
                        <>
                            <Divider sx={{ my: 4 }} />
                            <Typography sx={{ mb: 4 }} variant="h5" gutterBottom>Poäng som lades till:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {userPoints.map((user) => (
                                    <Box key={user.id} sx={{
                                        m: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center', // Align children (avatar, name, points) to the center
                                        textAlign: 'center',
                                    }}>
                                        <Avatar
                                            src={user.avatarImageUrl}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            sx={{ width: 56, height: 56, mb: 1 }}

                                        />
                                        <Typography variant="body2" gutterBottom>
                                            {user.firstName} {user.lastName}
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            Poäng: {user.points}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                        </>


                    )}
                </Box>
            </>
        )
    )
}

export default AddSubCompetitionScores