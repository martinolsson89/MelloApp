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
import AuthorizeAdminView from './AuthorizeAdminView';
import Navbar from './Navbar';

interface SubCompetition {
    id: string;
    name: string;
    date: string;
    location: string;
}

function AddSubCompetitionScores() {
    const [subCompetitions, setSubCompetitions] = useState<SubCompetition[]>([]);
    const [subCompLoading, setSubCompLoading] = useState<boolean>(false);
    const [selectedSubCompetitionId, setSelectedSubCompetitionId] = useState<string>('');
    const [error, setError] = useState<string>('');

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

  return (
    <AuthorizeAdminView>
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
                        <Button variant="contained" onClick={() => handleNavigation('/admin-center')}>
                    Go Back
                </Button>
                </>
            )}
        </Box>
    </AuthorizeAdminView>
  )
}

export default AddSubCompetitionScores