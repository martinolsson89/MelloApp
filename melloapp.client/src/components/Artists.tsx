import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    IconButton,
    Grid,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import AuthorizeAdminView from './AuthorizeAdminView';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

interface Artist {
    id?: string;
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

const Artists: React.FC = () => {
    const [subCompetitionsWithArtists, setSubCompetitionsWithArtists] = useState<SubCompetition[]>([]);
    const [newArtist, setNewArtist] = useState<Artist>({
        name: '',
        song: '',
        startingNumber: 0,
        subCompetitionId: '',
    });
    const [editArtistId, setEditArtistId] = useState<string>('');
    const [editArtist, setEditArtist] = useState<Artist>({
        id: '',
        name: '',
        song: '',
        startingNumber: 0,
        subCompetitionId: '',
    });

    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    // Fetch Sub Competitions with Artists
    const fetchSubCompetitionsWithArtists = async () => {
        try {
            const response = await fetch('/SubCompetition/GetSubCompetitionsWithArtists');
            if (!response.ok) {
                throw new Error('Failed to fetch sub-competitions with artists');
            }
            const data = await response.json();
            setSubCompetitionsWithArtists(data);
        } catch (error) {
            console.error('Error fetching sub-competitions with artists:', error);
        }
    };

    // Add a new Artist
    const addArtist = async () => {
        const { name, song, startingNumber, subCompetitionId } = newArtist;

        if (!name || !song || !startingNumber || !subCompetitionId) {
            alert('Please fill in all fields before adding.');
            return;
        }

        try {
            const response = await fetch('/Artists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newArtist),
            });
            if (!response.ok) {
                throw new Error('Failed to add artist');
            }
            // Reset the form fields
            setNewArtist({ name: '', song: '', startingNumber: 0, subCompetitionId: '' });
            fetchSubCompetitionsWithArtists();
        } catch (error) {
            console.error('Error adding artist:', error);
        }
    };

    // Update an Artist
    const updateArtist = async () => {
        const { id, name, song, startingNumber, subCompetitionId } = editArtist;

        if (!name || !song || !startingNumber || !subCompetitionId) {
            alert('Please fill in all fields before saving.');
            return;
        }

        try {
            await fetch(`/Artists/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, song, startingNumber, subCompetitionId }),
            });
            setEditArtistId('');
            setEditArtist({ id: '', name: '', song: '', startingNumber: 0, subCompetitionId: '' });
            fetchSubCompetitionsWithArtists(); // Refresh the list after update
        } catch (error) {
            console.error('Error updating artist:', error);
        }
    };

    // Delete an Artist
    const deleteArtist = async (id: string) => {
        try {
            const response = await fetch(`/Artists/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete artist');
            }
            fetchSubCompetitionsWithArtists();
        } catch (error) {
            console.error('Error deleting artist:', error);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchSubCompetitionsWithArtists();
    }, []);

    return (
        <AuthorizeAdminView>
            <Navbar />

            <Box
                sx={{
                    p: 4,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    my: 4,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Artists Management
                </Typography>

                {/* Add Artist */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Add Artist
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Starting Number"
                                type="number"
                                value={newArtist.startingNumber}
                                onChange={(e) =>
                                    setNewArtist({ ...newArtist, startingNumber: Number(e.target.value) })
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Name"
                                value={newArtist.name}
                                onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Song"
                                value={newArtist.song}
                                onChange={(e) => setNewArtist({ ...newArtist, song: e.target.value })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Sub Competition ID"
                                value={newArtist.subCompetitionId}
                                onChange={(e) =>
                                    setNewArtist({ ...newArtist, subCompetitionId: (e.target.value) })
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={addArtist}>
                                Add Artist
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {subCompetitionsWithArtists.map((subCompetition) => (
                    <Box key={subCompetition.id} sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            {subCompetition.name} ({new Date(subCompetition.date).toLocaleString()})
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Location: {subCompetition.location}
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Starting Number</TableCell>
                                        <TableCell>Artist ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Song</TableCell>
                                        <TableCell>Sub Competition ID</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {subCompetition.artists.map((artist) => (
                                        <TableRow key={artist.id}>
                                            <TableCell>
                                                {editArtistId === artist.id ? (
                                                    <TextField
                                                        type="number"
                                                        value={editArtist.startingNumber}
                                                        onChange={(e) =>
                                                            setEditArtist({
                                                                ...editArtist,
                                                                startingNumber: Number(e.target.value),
                                                            })
                                                        }
                                                        fullWidth
                                                    />
                                                ) : (
                                                    artist.startingNumber
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {artist.id}
                                            </TableCell>
                                            <TableCell>
                                                {editArtistId === artist.id ? (
                                                    <TextField
                                                        value={editArtist.name}
                                                        onChange={(e) =>
                                                            setEditArtist({ ...editArtist, name: e.target.value })
                                                        }
                                                        fullWidth
                                                    />
                                                ) : (
                                                    artist.name
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editArtistId === artist.id ? (
                                                    <TextField
                                                        value={editArtist.song}
                                                        onChange={(e) =>
                                                            setEditArtist({ ...editArtist, song: e.target.value })
                                                        }
                                                        fullWidth
                                                    />
                                                ) : (
                                                    artist.song
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editArtistId === artist.id ? (
                                                    <TextField
                                                        value={editArtist.subCompetitionId}
                                                        onChange={(e) =>
                                                            setEditArtist({
                                                                ...editArtist,
                                                                subCompetitionId: (e.target.value),
                                                            })
                                                        }
                                                        fullWidth
                                                    />
                                                ) : (
                                                    artist.subCompetitionId
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editArtistId === artist.id ? (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={updateArtist}
                                                            sx={{ mr: 1 }}
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() => setEditArtistId('')}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => {
                                                                setEditArtistId(artist.id!);
                                                                setEditArtist(artist);
                                                            }}
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton
                                                            color="secondary"
                                                            onClick={() => deleteArtist(artist.id!)}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ))}
                 <Button variant="contained" color="secondary" sx={{ m: 2 }} onClick={() => handleNavigation('/admin-center')}>
                            Go Back
                </Button>
            </Box>
        </AuthorizeAdminView>
    );
};

export default Artists;
