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
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import AuthorizeAdminView from './AuthorizeAdminView';
import Navbar from './Navbar';

interface SubCompetition {
    name: string;
    date: string;
    location: string;
}

const SubCompetitions: React.FC = () => {
    const [subCompetitions, setSubCompetitions] = useState([]);
    const [editId, setEditId] = useState<string>('');
    const [editName, setEditName] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [newSubCompetition, setNewSubCompetition] = useState<SubCompetition>({
        name: '',
        date: new Date().toISOString().slice(0, 16),
        location: '',
    });

    // Add these helper functions at the top of your file or in a utilities file
    function formatDateTimeLocal(dateString: string): string {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    function formatDateTimeDisplay(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleString(); // You can customize the locale and options if needed
    }


    // Fetch Sub Competitions
    const fetchSubCompetitions = async () => {
        try {
            const response = await fetch('/SubCompetition');
            if (!response.ok) {
                throw new Error('Failed to fetch sub-competitions');
            }
            const data = await response.json();
            setSubCompetitions(data);
        } catch (error) {
            console.error('Error fetching sub-competitions:', error);
        }
    };

    // Fetch Sub Competitions with Artists
    const fetchSubCompetitionsWithArtists = async () => {
        try {
            const response = await fetch('/SubCompetition/GetSubCompetitionsWithArtists');
            if (!response.ok) {
                throw new Error('Failed to fetch sub-competitions with artists');
            }
            const data = await response.json();
            console.log('Sub Competitions with Artists:', data);
        } catch (error) {
            console.error('Error fetching sub-competitions with artists:', error);
        }
    };

    // Add a Sub Competition
    const addSubCompetition = async () => {

        if (!newSubCompetition.name || !newSubCompetition.date || !newSubCompetition.location) {
            alert("Please fill in all fields before saving.")
            return;
        }

        // Convert the date to ISO format
        const isoDate = new Date(newSubCompetition.date).toISOString();

        const subCompetitionToPost = {
            ...newSubCompetition,
            date: isoDate,
        };


        try {
            const response = await fetch('/SubCompetition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subCompetitionToPost),
            });
            if (!response.ok) {
                throw new Error('Failed to add sub-competition');
            }
            // Reset the form fields
            setNewSubCompetition({ name: '', date: new Date().toISOString().slice(0, 16), location: '' });
            fetchSubCompetitions();
        } catch (error) {
            console.error('Error adding sub-competition:', error);
        }
    };

    // Update a Sub Competition
    const updateSubCompetition = async (id: string) => {

        if (!editName || !editDate || !editLocation) {
            alert('Please fill in all fields before saving.');
            return;
        }

        try {
            await fetch(`/SubCompetition/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editName,
                    date: new Date(editDate).toISOString(),
                    location: editLocation,
                }),
            });
            setEditId('');
            setEditName('');
            setEditDate('');
            setEditLocation('');
            fetchSubCompetitions(); // Refresh the list after update
        } catch (error) {
            console.error('Error updating sub-competition:', error);
        }
    };

    // Delete a Sub Competition
    const deleteSubCompetition = async (id: number) => {
        try {
            const response = await fetch(`/SubCompetition/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete sub-competition');
            }
            fetchSubCompetitions();
        } catch (error) {
            console.error('Error deleting sub-competition:', error);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchSubCompetitions();
    }, []);

    return (
        <AuthorizeAdminView>
            <Navbar />

            <Box sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                my: 4,
                boxShadow: 3,
            }}>
                <Typography variant="h4" gutterBottom>
                    Sub Competitions
                </Typography>

                {/* Add Sub Competition */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                        label="Name"
                        value={newSubCompetition.name}
                        onChange={(e) =>
                            setNewSubCompetition({ ...newSubCompetition, name: e.target.value })
                        }
                        fullWidth
                    />
                    <TextField
                        label="Date"
                        type="datetime-local"
                        value={newSubCompetition.date}
                        onChange={(e) =>
                            setNewSubCompetition({ ...newSubCompetition, date: e.target.value })
                        }
                        fullWidth
                    />
                    <TextField
                        label="Location"
                        value={newSubCompetition.location}
                        onChange={(e) =>
                            setNewSubCompetition({ ...newSubCompetition, location: e.target.value })
                        }
                        fullWidth
                    />

                    <Button variant="contained" onClick={addSubCompetition}>
                        Add
                    </Button>
                </Box>

                {/* Sub Competitions Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subCompetitions.map((subCompetition: any) => (
                                <TableRow key={subCompetition.id}>
                                    <TableCell>{subCompetition.id}</TableCell>
                                    <TableCell>
                                        {editId === subCompetition.id ? (
                                            <TextField
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                fullWidth
                                            />
                                        ) : (
                                            subCompetition.name
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editId === subCompetition.id ? (
                                            <TextField
                                                type="datetime-local"
                                                value={editDate}
                                                onChange={(e) => setEditDate(e.target.value)}
                                                fullWidth
                                            />
                                        ) : (
                                            formatDateTimeDisplay(subCompetition.date)
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editId === subCompetition.id ? (
                                            <TextField
                                                value={editLocation}
                                                onChange={(e) => setEditLocation(e.target.value)}
                                                fullWidth
                                            />
                                        ) : (
                                            subCompetition.location
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editId === subCompetition.id ? (
                                            <Button
                                                variant="contained"
                                                onClick={() => updateSubCompetition(subCompetition.id)}
                                            >
                                                Save
                                            </Button>
                                        ) : (
                                            <IconButton
                                                color="primary"
                                                onClick={() => {
                                                    setEditId(subCompetition.id);
                                                    setEditName(subCompetition.name);
                                                    setEditDate(formatDateTimeLocal(subCompetition.date));
                                                    setEditLocation(subCompetition.location);
                                                }}
                                            >
                                                <Edit />
                                            </IconButton>
                                        )}
                                        <IconButton
                                            color="secondary"
                                            onClick={() => deleteSubCompetition(subCompetition.id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>


                </TableContainer>

                {/* Button for fetching sub-competitions with artists */}
                <Button
                    variant="outlined"
                    onClick={fetchSubCompetitionsWithArtists}
                    sx={{ mt: 3 }}
                >
                    Fetch Sub Competitions with Artists
                </Button>
            </Box>
        </AuthorizeAdminView>
    );
};

export default SubCompetitions;
