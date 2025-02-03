import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { userService } from '../services/UserService';


interface Users {
    id: string;
    firstName: string;
    lastName: string;
    avatarImageUrl: string;
    points: number;
}


function AddFinalScore() {
    const [userPoints, setUserPoints] = useState<Users[]>([]);
    const IsAdmin = userService.isAdmin();

    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };


    const handleSubmit = () => {
        fetch(`https://www.slaktkampen.se/Points/CalculatePointsFinal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({}),
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

                    <Button variant="contained" sx={{ mx: 2 }} onClick={() => handleSubmit()}>Beräkna & lägg till poäng för finalen</Button>
                    <Button variant="contained" color="secondary" sx={{ mx: 2 }} onClick={() => handleNavigation('/admin-center')}>
                        Go Back
                    </Button>


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

export default AddFinalScore