import { useEffect, useState, ChangeEvent } from 'react';
import {
    Typography,
    Box,
    Avatar,
    Button,
    CircularProgress,
    TextField,
} from '@mui/material';
import { userService } from '../services/UserService';
import Navbar from "../components/Navbar";
import { useNavigate } from 'react-router-dom';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    hasMadeBet: boolean;
    avatarImageUrl: string | null;
}

function UserAvatar() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
    const [avatarUrls, setAvatarUrls] = useState<{ [key: string]: string }>({});
    const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
    const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string | null }>({});

    const IsAdmin = userService.isAdmin();

    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    useEffect(() => {
        // Fetch all users
        async function fetchUsers() {
            try {
                const response = await fetch('/Users');
                if (response.ok) {
                    const data: User[] = await response.json();
                    setUsers(data);
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchUsers();
    }, []);

    const handleFileChange = (id: string, event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFiles({ ...selectedFiles, [id]: file });

            // Clear any existing URL input for this user
            setAvatarUrls({ ...avatarUrls, [id]: '' });

            // Preview the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrls({ ...previewUrls, [id]: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlChange = (id: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const url = event.target.value;
        setAvatarUrls({ ...avatarUrls, [id]: url });

        // Clear any selected file for this user
        setSelectedFiles({ ...selectedFiles, [id]: null });

        // Update preview URL
        setPreviewUrls({ ...previewUrls, [id]: url });
    };

    const handleAvatarUpdate = async (id: string) => {
        const file = selectedFiles[id];
        const avatarUrl = avatarUrls[id];

        if (file) {
            // Handle file upload
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('userId', id);

            try {
                setIsUploading({ ...isUploading, [id]: true });
                const response = await fetch('/Account/UploadUserAvatar', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    // Update the user's avatar in the users array
                    setUsers((prevUsers) =>
                        prevUsers.map((user) =>
                            user.id === id ? { ...user, avatarImageUrl: data.avatarImageUrl } : user
                        )
                    );
                    alert('Avatar updated successfully!');
                    // Clear the selected file and preview
                    setSelectedFiles({ ...selectedFiles, [id]: null });
                    setPreviewUrls({ ...previewUrls, [id]: null });
                } else {
                    const errorData = await response.json();
                    alert(`Failed to upload avatar: ${errorData.message || 'Unknown error.'}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the avatar.');
            } finally {
                setIsUploading({ ...isUploading, [id]: false });
            }
        } else if (avatarUrl) {
            // Handle URL update
            try {
                setIsUploading({ ...isUploading, [id]: true });
                const response = await fetch('/Account/UpdateUserAvatarUrl', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id, avatarImageUrl: avatarUrl }),
                });

                if (response.ok) {
                    // Update the user's avatar in the users array
                    setUsers((prevUsers) =>
                        prevUsers.map((user) =>
                            user.id === id ? { ...user, avatarImageUrl: avatarUrl } : user
                        )
                    );
                    alert('Avatar URL updated successfully!');
                    // Clear the avatar URL input and preview
                    setAvatarUrls({ ...avatarUrls, [id]: '' });
                    setPreviewUrls({ ...previewUrls, [id]: null });
                } else {
                    const errorData = await response.json();
                    alert(`Failed to update avatar: ${errorData.message || 'Unknown error.'}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the avatar.');
            } finally {
                setIsUploading({ ...isUploading, [id]: false });
            }
        } else {
            alert('Please select a file or enter an image URL.');
        }
    };

    return (
        IsAdmin && (
            <>
                <Navbar />
                <Box sx={{ mt: 4, mx: 'auto', maxWidth: '800px', bgcolor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2, p: { xs: 2, md: 4 } }}>
                    <Typography variant="h4" gutterBottom>
                        User Avatars
                    </Typography>
                    {users.map((user) => (
                        <Box
                            key={user.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 4,
                                p: 2,
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                            }}
                        >
                            <Avatar
                                alt={`${user.firstName} ${user.lastName}`}
                                src={
                                    previewUrls[user.id] ||
                                    user.avatarImageUrl ||
                                    '/default-avatar.png'
                                }
                                sx={{ width: 80, height: 80, mr: 2 }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">
                                    {user.firstName} {user.lastName}
                                </Typography>
                                <Typography variant="body2">ID: {user.id}</Typography>
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        label="Image URL"
                                        variant="outlined"
                                        fullWidth
                                        value={avatarUrls[user.id] || ''}
                                        onChange={(event) => handleUrlChange(user.id, event)}
                                        sx={{ mb: 1 }}
                                    />
                                    <Typography variant="subtitle1">Or upload an image:</Typography>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{ mt: 1 }}
                                    >
                                        Choose File
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(event) => handleFileChange(user.id, event)}
                                        />
                                    </Button>
                                    {selectedFiles[user.id] && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Selected file: {selectedFiles[user.id]?.name}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', px: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAvatarUpdate(user.id)}
                                    disabled={isUploading[user.id]}
                                >
                                    {isUploading[user.id] ? <CircularProgress size={24} /> : 'Update img'}
                                </Button>
                            </Box>
                        </Box>
                    ))}
                    <Button variant="contained" color="secondary" sx={{ m: 2 }} onClick={() => handleNavigation('/admin-center')}>
                        Go Back
                    </Button>
                </Box>
            </>
        )
    );
}

export default UserAvatar;
