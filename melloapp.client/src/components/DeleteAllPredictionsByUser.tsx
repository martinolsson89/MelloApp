import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    ListItemAvatar,
    Avatar,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import Navbar from './Navbar';
import { userService } from '../services/UserService';
import BackButton from './BackButton';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    avatarImageUrl: string;
    hasMadeBet: boolean;
}

function DeleteAllPredictionsByUser() {
    const [users, setUsers] = useState<User[]>([]);
    const IsAdmin = userService.isAdmin();

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

    // Delete a Result
    const deleteUserPrediction = async (id: string) => {
        try {
            const response = await fetch(`/Account/AllByUserId/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete result');
            }
            fetchUsers();
        } catch (error) {
            console.error('Error deleting result:', error);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchUsers();
    }, []);


    return (
        IsAdmin && (
            <>
                <Navbar />
                <Box sx={{ mt: 4, mx: 'auto', p: 3, maxWidth: 900, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
                    <Typography variant="h4" gutterBottom textAlign="center">
                        User Predictions Management
                    </Typography>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Users
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
                                    {users.length > 0 ? (
                                        users.map((user: User) => (
                                            <TableRow key={user.id}>
                                                <TableCell>{user.id}</TableCell>
                                                <TableCell>
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            src={user.avatarImageUrl}
                                                            alt={user.firstName}
                                                            sx={{ width: 56, height: 56 }}
                                                        />
                                                    </ListItemAvatar>
                                                </TableCell>
                                                <TableCell>
                                                    {user
                                                        ? `${user.firstName} ${user.lastName}`
                                                        : 'Unknown User'}
                                                </TableCell>
                                                <TableCell>
                                                    {`Has made bet: ${user.hasMadeBet}`}
                                                </TableCell>
                                                <TableCell>
                                                    {user.hasMadeBet === true ? (
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => deleteUserPrediction(user.id)}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    ) : (

                                                        <Delete sx={{ color: 'grey', mx: 1 }} />

                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <BackButton />
                </Box>
            </>
        )
    )
}

export default DeleteAllPredictionsByUser