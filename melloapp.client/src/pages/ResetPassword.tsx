import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [resetSuccessful, setResetSuccessful] = useState<boolean>(false); // New state variable

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(null);
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Lösenorden matchar inte."); // "Passwords do not match."
            return;
        }

        try {
            const response = await fetch("/Account/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    token,
                    newPassword,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message || "Lösenordet har återställts."); // "Password has been reset."
                setResetSuccessful(true); // Set to true on success
            } else {
                const data = await response.json();
                setError(data.message || "Återställning av lösenord misslyckades."); // "Password reset failed."
            }
        } catch (err) {
            setError("Kunde inte ansluta till servern. Försök igen."); // "Unable to connect to the server. Please try again."
        }
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    if (!token || !email) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h6">Ogiltig eller saknad token och e-postadress.</Typography>
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            padding={3}
            sx={{ p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.7)' }}
        >
            {resetSuccessful ? (
                // **Content to display after successful password reset**
                <Box
                    sx={{ width: "100%", maxWidth: 400, textAlign: "center", bgcolor: 'white', p: 3, borderRadius: 2 }}
                >
                    <Typography variant="h4" gutterBottom>
                        Lösenord återställt
                    </Typography>
                    <Alert severity="success" sx={{ marginBottom: 2 }}>
                        {message}
                    </Alert>
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        Ditt lösenord har återställts. Du kan nu logga in med ditt nya lösenord.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleNavigation('/login')}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        Gå till inloggning
                    </Button>
                </Box>
            ) : (
                // **Reset password form**
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ width: "100%", maxWidth: 400, textAlign: "center", bgcolor: 'white', p: 3, borderRadius: 2 }}
                >
                    <Typography variant="h4" gutterBottom>
                        Skapa nytt lösenord
                    </Typography>
                    {message && <Alert severity="success" sx={{ marginBottom: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
                    <TextField
                        fullWidth
                        label="Nytt lösenord"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Upprepa lösenord"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        Återställ lösenord
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ m: 2 }}
                        onClick={() => handleNavigation('/')}
                    >
                        Gå tillbaka
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default ResetPassword;
