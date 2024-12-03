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
    IconButton,
    ListItemAvatar,
    Avatar,
    Dialog,
    DialogTitle,
    DialogActions,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Navbar from './Navbar';
import { userService } from '../services/UserService';
import BackButton from './BackButton';


interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarImageUrl: string;
    hasMadeBet: boolean;
}

interface EditUser {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    hasMadeBet: boolean;
}

function DeleteUser() {
    const [users, setUsers] = useState<User[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editUser, setEditUser] = useState<EditUser>({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        hasMadeBet: false,
    });

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

    // Update an User
    const updateUser = async () => {
        const { id, firstName, lastName, email, hasMadeBet } = editUser;

        if (!firstName || !lastName || !email) {
            alert('Please fill in all fields before saving.');
            return;
        }

        try {
            const response = await fetch(`/Account/user/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, hasMadeBet }),
            });
            if (response.ok) {
                setResponseMessage('User was updated successfully!');
            } else {
                setResponseMessage('Failed to update user information.');
                throw new Error('Failed to delete user');
            }
            setEditUser({ id: '', firstName: '', lastName: '', email: '', hasMadeBet: false });
            fetchUsers(); // Refresh the list after update
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // Delete a User
    const deleteUser = async (id: string) => {
        try {
            const response = await fetch(`/Account/user/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setResponseMessage('User was deleted successfully!');
            } else {
                setResponseMessage('Failed to delete user.');
                throw new Error('Failed to delete user.');
            }
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteClick = (id: string) => {
        setUserIdToDelete(id);
        setShowDeleteConfirm(true);
    };
    const handleCloseDialog = () => {
        setShowDeleteConfirm(false);
        setResponseMessage(''); // Återställer meddelandet
    };

    const handleEditClick = (user: User) => {
        setEditUser({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            hasMadeBet: user.hasMadeBet
        });
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setEditUser({ id: '', firstName: '', lastName: '', email: '', hasMadeBet: false });
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
                        Delete User Account Permanent
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
                                        <TableCell>Avatar</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Has Bet?</TableCell>
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
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    {user
                                                        ? `${user.firstName} ${user.lastName}`
                                                        : 'Unknown User'}
                                                </TableCell>
                                                <TableCell>
                                                    {`${user.hasMadeBet}`}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleEditClick(user)}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDeleteClick(user.id)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
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
                        {/* Edit Dialog */}
                        <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                            {responseMessage === '' ? (
                                <>
                                    <DialogTitle>Edit User</DialogTitle>
                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="body1" gutterBottom>
                                            Edit the fields below:
                                        </Typography>
                                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                value={editUser.firstName}
                                                onChange={(e) =>
                                                    setEditUser({ ...editUser, firstName: e.target.value })
                                                }
                                            />
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                value={editUser.lastName}
                                                onChange={(e) =>
                                                    setEditUser({ ...editUser, lastName: e.target.value })
                                                }
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={editUser.email}
                                                onChange={(e) =>
                                                    setEditUser({ ...editUser, email: e.target.value })
                                                }
                                            />
                                           <label>
                                            Has Made Bet:
                                            <input
                                                type="checkbox"
                                                checked={editUser.hasMadeBet}
                                                onChange={(e) =>
                                                    setEditUser({ ...editUser, hasMadeBet: e.target.checked })
                                                }
                                            />
                                        </label>
                                        </Box>
                                    </Box>
                                    <DialogActions>
                                        <Button onClick={handleEditDialogClose} color="secondary">
                                            Cancel
                                        </Button>
                                        <Button onClick={updateUser} color="primary" variant="contained">
                                            Save
                                        </Button>
                                    </DialogActions>
                                </>
                            ) : (
                                <>
                                    <DialogTitle>{responseMessage}</DialogTitle>
                                    <DialogActions>
                                        <Button
                                            onClick={() => {
                                                handleEditDialogClose();
                                                setResponseMessage(''); // Återställ meddelandet när dialogen stängs
                                            }}
                                            color="secondary"
                                            variant="outlined"
                                        >
                                            Close
                                        </Button>
                                    </DialogActions>
                                </>
                            )}
                        </Dialog>
                        {/* Delete Confirmation Dialog */}
                        <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
                            {responseMessage == '' ? (
                                <>
                                    <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
                                    <DialogActions>
                                        <Button
                                            onClick={() => deleteUser(userIdToDelete)}
                                            color="error"
                                            variant="contained"
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            color="primary"
                                            variant="outlined"
                                        >
                                            No
                                        </Button>
                                    </DialogActions>
                                </>
                            ) : (
                                <>
                                    <DialogTitle>{responseMessage}</DialogTitle>
                                    <Button
                                        onClick={() => handleCloseDialog()}
                                        color="secondary"
                                        variant="outlined"
                                    >
                                        Close
                                    </Button>
                                </>
                            )}
                        </Dialog>
                    </Box>
                    <BackButton />
                </Box>
            </>
        )
    )
}

export default DeleteUser