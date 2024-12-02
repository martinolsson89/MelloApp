import React, { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/login');
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(null);
        setError(null);
    
        try {
            const response = await fetch('/Account/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify JSON content type
                },
                body: JSON.stringify({ email }), // Convert email to JSON object
            });
    
            if (response.ok) {
                const data = await response.json();
                setMessage(data.message || "Om mejlen är registrerad skickas en återställningslänk.");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Något gick fel, prova igen.");
            }
        } catch (err) {
            setError("Kunde inte ansluta till servern, prova igen.");
        }
    };
    

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            padding={3}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%", maxWidth: 400, textAlign: "center", borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.7)', p: 3, mt: 6, boxShadow: 3 }}
            >
                <Typography variant="h4" gutterBottom>
                    Återställ lösenord
                </Typography>
                <Typography variant="body1" marginBottom={3}>
                    Skriv in din email, en länk skickas ut så att du kan återställa ditt lösenord.
                </Typography>
                {message && <Alert severity="success" sx={{ marginBottom: 2 }}>{message}</Alert>}
                {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
                <TextField
                    fullWidth
                    label="EmailAdress"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2, marginBottom: 2 }}
                >
                    Skicka återställningslänk
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleLoginClick} fullWidth>
                        Gå till logga in
                </Button>
            </Box>
        </Box>
    );
};

export default ForgotPassword;
