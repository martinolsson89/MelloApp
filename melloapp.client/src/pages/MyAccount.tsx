import { useEffect, useState, ChangeEvent } from 'react';
import { Typography, Box, Divider, Avatar, TextField, Button, CircularProgress } from '@mui/material';
import Navbar from "../components/Navbar";
import defaultProfilePic from '../assets/avatar/anonymous-user.webp';
import { userService } from '../services/UserService';

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

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const isLoggedIn = userService.isLoggedIn();

    useEffect(() => {
        // Fetch data from the backend
        async function fetchUserData() {
            try {
                let userResponse = await fetch('/Account/pingauthme');
                if (userResponse.status === 200) {
                    let data = await userResponse.json();
                    setUserData(data);
                    console.log(data);
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

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']; // Common image formats
            const maxSize = 5 * 1024 * 1024; // 5 MB in bytes

            if (!validTypes.includes(file.type)) {
                alert('Ogiltig filtyp. Vänligen välj en bild i JPEG, PNG, GIF, WEBP, eller HEIC-format.');
                return;
            }

            if (file.size > maxSize) {
                alert('Filen är för stor. Maximal storlek är 5 MB.');
                return;
            }

            // File is valid; preview it
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string); // Set preview image URL
            };
            reader.readAsDataURL(file);
        }
    };


    const handleAvatarUpdate = async () => {
        if (selectedFile) {
            // Handle file upload using Fetch
            const formData = new FormData();
            formData.append('avatar', selectedFile);

            try {
                setIsUploading(true);
                const response = await fetch('/Account/uploadAvatar', {
                    method: 'POST',
                    body: formData,
                    // Note: Fetch automatically sets the 'Content-Type' header to 'multipart/form-data' with the correct boundary
                });

                if (response.ok) {
                    const data = await response.json();
                    const newAvatarUrl = data.avatarImageUrl;
                    // Update the avatar URL in the database
                    const updateResponse = await fetch('/Account/updateAvatar', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ avatarImageUrl: newAvatarUrl }),
                    });

                    if (updateResponse.ok) {
                        setUserData((prevData) =>
                            prevData ? { ...prevData, avatarImageUrl: newAvatarUrl } : prevData
                        );
                        alert('Profilbild uppdaterad!');
                        setSelectedFile(null);
                    } else {
                        alert('Kunde inte uppdatera profilbilden.');
                    }
                } else {
                    const errorData = await response.json();
                    alert(`Kunde inte ladda upp bilden: ${errorData.message || 'Okänt fel.'}`);
                }
            } catch (error) {
                console.error('Ett fel inträffade:', error);
                alert('Ett fel inträffade vid uppdatering av profilbilden.');
            } finally {
                setIsUploading(false);
            }
        } else if (avatarUrl) {
            // If user provided a URL instead of uploading a file
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
                    setUserData((prevData) =>
                        prevData ? { ...prevData, avatarImageUrl: avatarUrl } : prevData
                    );
                    alert('Profilbild uppdaterad!');
                } else {
                    const errorData = await response.json();
                    alert(`Kunde inte uppdatera profilbilden: ${errorData.message || 'Okänt fel.'}`);
                }
            } catch (error) {
                console.error('Ett fel inträffade:', error);
                alert('Ett fel inträffade vid uppdatering av profilbilden.');
            }
        } else {
            alert('Vänligen ange en giltig bild eller välj en fil att ladda upp.');
        }
    };

    if (isLoading) {
        return (
            isLoggedIn && (
                <>
                    <Navbar />
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: 'white' }}>Laddar...</Typography>
                    </Box>
                </>
            )
        );
    }

    return (
        isLoggedIn && (
            <>
                <Navbar />
                <Box
                    sx={{
                        mt: 4,
                        mx: 'auto',
                        p: { xs: 2, md: 4 },
                        maxWidth: { xs: '90%', md: '60%' },
                        boxShadow: 3,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
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

                    <Divider sx={{ mt: 2 }} />

                    <Avatar
                        alt={userData?.firstName}
                        src={userData?.avatarImageUrl || defaultProfilePic}
                        sx={{ width: 150, height: 150, mb: 2 }}
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
                        Ladda upp profilbild
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Klistra in bildadress:
                    </Typography>

                    <Box sx={{ width: '100%', mb: 2 }}>
                        <TextField
                            label="Bild URL"
                            variant="outlined"
                            fullWidth
                            value={avatarUrl}
                            onChange={handleAvatarUrlChange}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Eller ladda upp en bild:
                        </Typography>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            Välj bild
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                        {selectedFile && (
                            <>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Vald bild: {selectedFile.name}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <img
                                        src={avatarUrl} // Use avatarUrl for the preview
                                        alt="Förhandsvisning"
                                        style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleAvatarUpdate}
                        disabled={isUploading}
                    >
                        {isUploading ? <CircularProgress size={24} /> : 'Spara bild'}
                    </Button>
                </Box>
            </>
        )
    );
}

export default MyAccount;