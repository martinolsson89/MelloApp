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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/UserService';

interface SubCompetitionName {
    id: string;
    name: string;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
}

interface UserPoint {
    id: string;
    points: number;
    user: User;
    subCompetitionName: SubCompetitionName;

}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    avatarImageUrl: string;
    hasMadeBet: boolean;
}

function PointsManagement() {
    const [userPoints, setUserPoints] = useState<UserPoint[]>([]);
    const [newPoints, setNewPoints] = useState({
        points: 0,
        userId: '',
        subCompetitionId: ''
    });
    const [users, setUsers] = useState<User[]>([]);
    const IsAdmin = userService.isAdmin();


    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/Users');
            if (!response.ok) {
                throw new Error('Failed to user points');
            }
            const data = await response.json();
            setUsers(data);

        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchUserPoints = async () => {
        try {
            const response = await fetch('/ScoreAfterSubCompetition/GetUserScores');
            if (!response.ok) {
                throw new Error('Failed to user points');
            }
            const data = await response.json();
            setUserPoints(data);

        } catch (error) {
            console.error('Error fetching sub-competitions with results:', error);
        }
    };


    // Add a new points entry
    const addPoints = async () => {
        const { points, userId, subCompetitionId } = newPoints;

        if (!points || !userId || !subCompetitionId) {
            alert('Please fill in all required fields before adding.');
            return;
        }


        try {
            const response = await fetch('/ScoreAfterSubCompetition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPoints),
            });
            if (!response.ok) {
                throw new Error('Failed to add result');
            }
            // Reset the form fields
            setNewPoints({ points: 0, userId: '', subCompetitionId: '' });
            fetchUserPoints();
        } catch (error) {
            console.error('Error adding result:', error);
        }
    };
    // /ScoreAfterSubCompetition/{id}
    // Delete a Result
    const deleteUserPoints = async (id: string) => {
        try {
            const response = await fetch(`/ScoreAfterSubCompetition/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete result');
            }
            fetchUserPoints();
        } catch (error) {
            console.error('Error deleting result:', error);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchUserPoints();
        fetchUsers();

    }, []);
    return (
        IsAdmin && (
            <>
                <Navbar />
                <Box sx={{ mt: 4, mx: 'auto', p: 3, maxWidth: 900, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
                    <Typography variant="h4" gutterBottom textAlign="center">
                        Points Management
                    </Typography>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Add New Points Entry
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Points"
                                    type="number"
                                    value={newPoints.points}
                                    onChange={(e) =>
                                        setNewPoints((prev) => ({
                                            ...prev,
                                            points: Number(e.target.value),
                                        }))
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>User</InputLabel>
                                    <Select
                                        value={newPoints.userId}
                                        onChange={(e) =>
                                            setNewPoints((prev) => ({
                                                ...prev,
                                                userId: e.target.value,
                                            }))
                                        }
                                    >
                                        {[...new Map(users
                                            .filter((user) => user) // Ensure user exists
                                            .map((user) => [user.id, user]) // Map user IDs to user objects
                                        ).values()].map((uniqueUser) => (
                                            <MenuItem key={uniqueUser.id} value={uniqueUser.id}>
                                                {uniqueUser.firstName} {uniqueUser.lastName}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Sub-Competition</InputLabel>
                                    <Select
                                        value={newPoints.subCompetitionId}
                                        onChange={(e) =>
                                            setNewPoints((prev) => ({
                                                ...prev,
                                                subCompetitionId: e.target.value,
                                            }))
                                        }
                                    >
                                        {[...new Map(userPoints
                                            .filter((entry) => entry.subCompetitionName) // Ensure user exists
                                            .map((entry) => [entry.subCompetitionName.id, entry.subCompetitionName]) // Map user IDs to user objects
                                        ).values()].map((uniqueSubComp) => (
                                            <MenuItem key={uniqueSubComp.id} value={uniqueSubComp.id}>
                                                {uniqueSubComp.name}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    onClick={addPoints}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    Add Points
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Existing Points Entries
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>User</TableCell>
                                        <TableCell>Sub-Competition</TableCell>
                                        <TableCell>Points</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userPoints.length > 0 ? (
                                        userPoints.map((entry) => (
                                            <TableRow key={entry.id}>
                                                <TableCell>{entry.id}</TableCell>
                                                <TableCell>
                                                    {entry.user
                                                        ? `${entry.user.firstName} ${entry.user.lastName}`
                                                        : 'Unknown User'}
                                                </TableCell>
                                                <TableCell>
                                                    {entry.subCompetitionName ? entry.subCompetitionName.name : 'Unknown Sub-Competition'}
                                                </TableCell>
                                                <TableCell>{entry.points}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => deleteUserPoints(entry.id)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                No points entries found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <Button variant="contained" color="secondary" sx={{ m: 2 }} onClick={() => handleNavigation('/admin-center')}>
                        Go Back
                    </Button>
                </Box>
            </>
        )
    )
}

export default PointsManagement