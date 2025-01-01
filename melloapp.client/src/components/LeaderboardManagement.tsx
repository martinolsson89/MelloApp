import { useEffect, useState } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/UserService';

/** 
 *  Server DTOs reference:
 *  
 *  GET =>  GetLeaderboardDto  { id, points, userId, user }
 *  POST => AddLeaderboardDto  { points, userId }
 *  PUT  => UpdateLeaderboardDto { id, points, userId (optional) }
 *  DELETE => /Leaderboard/{id}
 */

/** Example of GetUserDto properties; adjust as needed. */
interface GetUserDto {
    id: string;
    firstName: string;
    lastName: string;
    // Add other fields as needed
}

/** Matches GetLeaderboardDto from your server */
interface LeaderboardDto {
    id: string;
    points: number;
    userId: string;
    user?: GetUserDto; // user is optional
}

/** Matches AddLeaderboardDto */
interface AddLeaderboardDto {
    points: number;
    userId: string;
}

/** Matches UpdateLeaderboardDto */
interface UpdateLeaderboardDto {
    id: string;
    points: number;
    userId?: string;
}

/** Example of a user used in a dropdown; 
 *  you can also re-use GetUserDto if they match exactly.
 */
interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
}

function LeaderboardManagement() {
    const [leaderboards, setLeaderboards] = useState<LeaderboardDto[]>([]);

    /** For adding a new leaderboard entry */
    const [newLeaderboard, setNewLeaderboard] = useState<AddLeaderboardDto>({
        points: 0,
        userId: '',
    });

    /** For editing an existing leaderboard entry */
    const [editLeaderboardId, setEditLeaderboardId] = useState<string | null>(null);
    const [editLeaderboardData, setEditLeaderboardData] = useState<UpdateLeaderboardDto>({
        id: '',
        points: 0,
        userId: '',
    });

    /** For user dropdown (assuming /Users endpoint) */
    const [users, setUsers] = useState<UserDto[]>([]);

    const navigate = useNavigate();
    const isAdmin = userService.isAdmin();

    // --- FETCH DATA ---

    /** Fetch all leaderboard entries (GetLeaderboardDto) */
    const fetchLeaderboards = async () => {
        try {
            const response = await fetch('/Leaderboard');
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboards');
            }
            const data: LeaderboardDto[] = await response.json();
            setLeaderboards(data);
        } catch (error) {
            console.error('Error fetching leaderboards:', error);
        }
    };

    /** Fetch users (to populate dropdown) */
    const fetchUsers = async () => {
        try {
            const response = await fetch('/Users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data: UserDto[] = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // --- ADD ---

    /** Add a new leaderboard entry (using AddLeaderboardDto) */
    const addLeaderboard = async () => {
        const { points, userId } = newLeaderboard;

        if (!userId || points === undefined) {
            alert('Please provide all required fields (points, user).');
            return;
        }

        try {
            const response = await fetch('/Leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ points, userId } as AddLeaderboardDto),
            });
            if (!response.ok) {
                throw new Error('Failed to add leaderboard');
            }
            // Clear the form
            setNewLeaderboard({ points: 0, userId: '' });
            // Refresh the list
            fetchLeaderboards();
        } catch (error) {
            console.error('Error adding leaderboard:', error);
        }
    };

    // --- EDIT ---

    /** Opens the edit dialog with an existing leaderboard's data */
    const handleEditClick = (leaderboard: LeaderboardDto) => {
        setEditLeaderboardId(leaderboard.id);
        setEditLeaderboardData({
            id: leaderboard.id,
            points: leaderboard.points,
            userId: leaderboard.userId,
        });
    };

    /** Closes the edit dialog */
    const handleEditClose = () => {
        setEditLeaderboardId(null);
        setEditLeaderboardData({ id: '', points: 0, userId: '' });
    };

    /** Update an existing leaderboard entry (using UpdateLeaderboardDto) */
    const updateLeaderboard = async () => {
        if (!editLeaderboardId) return;

        try {
            const { id, points, userId } = editLeaderboardData;
            const response = await fetch(`/Leaderboard/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, points, userId } as UpdateLeaderboardDto),
            });
            if (!response.ok) {
                throw new Error('Failed to update leaderboard');
            }
            // Close the dialog and refresh
            handleEditClose();
            fetchLeaderboards();
        } catch (error) {
            console.error('Error updating leaderboard:', error);
        }
    };

    // --- DELETE ---

    /** Delete a leaderboard entry by ID */
    const deleteLeaderboard = async (id: string) => {
        try {
            const response = await fetch(`/Leaderboard/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete leaderboard');
            }
            fetchLeaderboards();
        } catch (error) {
            console.error('Error deleting leaderboard:', error);
        }
    };

    // --- LIFECYCLE ---

    useEffect(() => {
        fetchLeaderboards();
        fetchUsers();
    }, []);

    // --- NAVIGATION ---

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    // --- RENDERING ---

    if (!isAdmin) {
        return (
            <>
                <Navbar />
                <Box sx={{ mt: 4, mx: 'auto', p: 3, maxWidth: 900 }}>
                    <Typography variant="h6" color="error">
                        You do not have admin privileges.
                    </Typography>
                </Box>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Box
                sx={{
                    mt: 4,
                    mx: 'auto',
                    p: 3,
                    maxWidth: 900,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                }}
            >
                <Typography variant="h4" gutterBottom textAlign="center">
                    Leaderboard Management
                </Typography>

                {/* Add New Leaderboard Entry */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Add New Leaderboard Entry
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Points"
                                type="number"
                                value={newLeaderboard.points}
                                onChange={(e) =>
                                    setNewLeaderboard((prev) => ({
                                        ...prev,
                                        points: Number(e.target.value),
                                    }))
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>User</InputLabel>
                                <Select
                                    value={newLeaderboard.userId}
                                    label="User"
                                    onChange={(e) =>
                                        setNewLeaderboard((prev) => ({
                                            ...prev,
                                            userId: e.target.value,
                                        }))
                                    }
                                >
                                    {users.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.firstName} {user.lastName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                onClick={addLeaderboard}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Add Leaderboard
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {/* Existing Leaderboards */}
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Existing Leaderboards
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Points</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leaderboards.length > 0 ? (
                                    leaderboards.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell>{entry.id}</TableCell>
                                            <TableCell>{entry.points}</TableCell>
                                            <TableCell>
                                                {entry.user
                                                    ? `${entry.user.firstName} ${entry.user.lastName}`
                                                    : 'Unknown'}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEditClick(entry)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => deleteLeaderboard(entry.id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No leaderboard entries found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ m: 2 }}
                    onClick={() => handleNavigation('/admin-center')}
                >
                    Go Back
                </Button>
            </Box>

            {/* Edit Dialog */}
            <Dialog open={Boolean(editLeaderboardId)} onClose={handleEditClose}>
                <DialogTitle>Edit Leaderboard</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Points"
                        fullWidth
                        type="number"
                        value={editLeaderboardData.points}
                        onChange={(e) =>
                            setEditLeaderboardData((prev) => ({
                                ...prev,
                                points: Number(e.target.value),
                            }))
                        }
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>User</InputLabel>
                        <Select
                            value={editLeaderboardData.userId || ''}
                            label="User"
                            onChange={(e) =>
                                setEditLeaderboardData((prev) => ({
                                    ...prev,
                                    userId: e.target.value,
                                }))
                            }
                        >
                            {/* Optionally allow changing the user on edit */}
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.firstName} {user.lastName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button variant="contained" onClick={updateLeaderboard}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default LeaderboardManagement;
