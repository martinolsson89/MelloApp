import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Select,
    MenuItem,
    TextField,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthorizeAdminView from './AuthorizeAdminView';
import Navbar from './Navbar';

const UpdatePointsForm = () => {
    const [deltavling, setDeltavling] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [points, setPoints] = useState('');


    const navigate = useNavigate();
    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const formData = {
            firstName: firstName,
            lastName: lastName,
            subCompetitionName: deltavling,
            points: parseInt(points, 10), // Ensure points are sent as a number
        };
        console.log('Submitting:', formData);


        try {
            const response = await fetch('https://localhost:7263/Points/update-points-by-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Update successful:', result);
                alert('Points updated successfully!');
            } else {
                const error = await response.json();
                console.error('Update failed:', error);
                alert('Failed to update points. Please check the data and try again.');
            }
        } catch (err) {
            console.error('Request error:', err);
            alert('An error occurred while updating points.');
        }
    };

    return (
        <>
            <AuthorizeAdminView>
                <Navbar />
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <Typography variant="h4">Update points</Typography>
                        </CardHeader>
                        <CardContent>
                            <Typography variant="h6">Deltävling</Typography>
                            <Select
                                value={deltavling}
                                onChange={(e) => setDeltavling(e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>Välj deltävling</em>
                                </MenuItem>
                                <MenuItem value="Deltävling 1">Deltävling 1</MenuItem>
                                <MenuItem value="Deltävling 2">Deltävling 2</MenuItem>
                                <MenuItem value="Deltävling 3">Deltävling 3</MenuItem>
                                <MenuItem value="Deltävling 4">Deltävling 4</MenuItem>
                                <MenuItem value="Deltävling 5">Deltävling 5</MenuItem>
                            </Select>
                            <Typography variant="h6">Användare</Typography>
                            <TextField
                                label="Skriv förnamn"
                                variant="outlined"
                                fullWidth
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                sx={{mb:2}}
                            />
                            <TextField
                                label="Skriv efternamn"
                                variant="outlined"
                                fullWidth
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <Typography variant="h6">Poäng</Typography>
                            <TextField
                                label="Skriv in poäng"
                                variant="outlined"
                                fullWidth
                                value={points}
                                onChange={(e) => setPoints(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                    <Button type="submit" variant="contained" color="primary" sx={{mt:2}}>
                        Skicka uppdatering
                    </Button>
                </form>
                <Button variant="contained" color="secondary" sx={{mt:4}} onClick={() => handleNavigation('/admin-center')}>
                    Go Back
                </Button>
            </AuthorizeAdminView>
        </>
    );
};

export default UpdatePointsForm;
