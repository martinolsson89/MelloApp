import { useEffect, useState } from 'react';
import { Typography, Box, Divider, Avatar, TextField, Button } from '@mui/material';
import AuthorizeView from "../components/AuthorizeView";
import Navbar from "../components/Navbar";
import defaultProfilePic from '../assets/avatar/anonymous-user.webp';

interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    hasMadeBet: boolean;
    avatarImageUrl: string | null;
}

function MyAccount() {
    const [userData, setUserData] = useState<UserDto | null>(null);
    const [hasBet, setHasBet] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        // Fetch data from the backend
        async function fetchUserData() {
            try {
                let userResponse = await fetch('/Account/pingauthme');
                if (userResponse.status === 200) {
                    let data = await userResponse.json();
                    setUserData(data);
                    setHasBet(data.hasMadeBet);
                    setAvatarUrl(data.avatarImageUrl || '');
                } else {
                    throw new Error('Error fetching user data');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUserData();
    }, []);

    const handleAvatarUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAvatarUrl(event.target.value);
    };

    const handleAvatarUpdate = async () => {
        if (!avatarUrl) {
            alert('Please enter a valid image URL.');
            return;
        }

        // Optional: Validate the URL format here

        try {
            const response = await fetch('/Account/updateAvatar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ avatarImageUrl: avatarUrl }),
            });
            console.log(response);
            if (response.ok) {
                // Update the userData state to reflect the new avatar URL
                setUserData((prevData) =>
                    prevData ? { ...prevData, avatarImageUrl: avatarUrl } : prevData
                );
                alert('Profilbild uppdaterad!');
            } else {
                alert('Kunde inte uppdatera profilbilden.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('Ett fel inträffade vid uppdatering av profilbilden.');
        }
    };

    if (isLoading) {
        return (
            <AuthorizeView>
                <Navbar />
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h6">Laddar...</Typography>
                </Box>
            </AuthorizeView>
        );
    }

    return (
        <AuthorizeView>
            <Navbar />
            <Box
                sx={{
                    mt: 4,
                    mx: 'auto',
                    p: { xs: 2, md: 4 },
                    maxWidth: { xs: '90%', md: '60%' },
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Mitt konto
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Avatar
                    alt={userData?.firstName}
                    src={userData?.avatarImageUrl || defaultProfilePic}
                    sx={{ width: 100, height: 100, mb: 2 }}
                />

                <Typography variant="h6" gutterBottom>
                    Namn:
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 1 }}>
                    {userData?.firstName} {userData?.lastName}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Email:
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 1 }}>
                    {userData?.email}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Har lämnat in tips:
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 1 }}>
                    {hasBet ? 'Ja' : 'Nej'}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Uppdatera profilbild
                </Typography>
                <TextField
                    label="Bild URL"
                    variant="outlined"
                    fullWidth
                    value={avatarUrl}
                    onChange={handleAvatarUrlChange}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleAvatarUpdate}>
                    Uppdatera
                </Button>
            </Box>
        </AuthorizeView>
    );
}

export default MyAccount;
