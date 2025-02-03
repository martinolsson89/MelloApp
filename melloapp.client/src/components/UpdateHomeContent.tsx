import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
} from '@mui/material';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/UserService';

function UpdateHomeContent() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const IsAdmin = userService.isAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch current home content from your backend
        const fetchHomeContent = async () => {
            setLoading(true);
            try {
                const response = await fetch('/HomeContent');
                if (response.ok) {
                    const data = await response.json();
                    setTitle(data.title || '');
                    setDescription(data.description || '');
                    setLinkUrl(data.linkUrl || '');
                    setLinkText(data.linkText || '');
                    setImageUrl(data.imageUrl || '');
                } else {
                    console.error('Failed to fetch home content.');
                }
            } catch (err) {
                console.error('Error fetching home content:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeContent();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Build updatedContent object
        const updatedContent = {
            title,
            description,
            linkUrl,
            linkText,
            imageUrl,
        };

        try {
            const response = await fetch('/HomeContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedContent),
            });

            if (response.ok) {
                alert('Home content updated successfully!');
            } else {
                const error = await response.json();
                console.error('Failed to update home content:', error);
                alert('Failed to update the content. Please try again.');
            }
        } catch (err) {
            console.error('Request error:', err);
            alert('An error occurred while updating the content.');
        }
    };

    if (loading) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        IsAdmin && (
            <>
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
                        maxWidth: 600,
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Update Home Page Content
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Link URL"
                            variant="outlined"
                            fullWidth
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Link Text"
                            variant="outlined"
                            fullWidth
                            value={linkText}
                            onChange={(e) => setLinkText(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Image URL"
                            variant="outlined"
                            fullWidth
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Update Content
                        </Button>
                    </form>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/admin-center')}
                    >
                        Go Back
                    </Button>
                </Box>
            </>
        )
    );
}

export default UpdateHomeContent;
