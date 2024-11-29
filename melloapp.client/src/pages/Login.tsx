import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Checkbox, FormControlLabel, Typography, Button, Box, Alert } from '@mui/material';
import imageUrl from '../assets/sweden-melodifestivalen-2025-logo.jpg';
import { userService } from '../services/UserService';

function Login() {
    // state variables for email and password
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberme, setRememberme] = useState<boolean>(false);
    // state variable for error message
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const navigate = useNavigate();

    // handle change events for input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        } else if (name === 'rememberme') {
            setRememberme(e.target.checked);
        }
    };
    const handleRegisterClick = () => {
        navigate('/register');
    }

    // handle submit event for the form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // validate email and password
        if (!email || !password) {
            setError('Email and password are required');
        } else {
            // clear error message
            setError('');
            // post data to the /register api

            let loginUrl = '';
            if (rememberme) {
                loginUrl = '/login?useCookies=true';
            } else {
                loginUrl = 'login?useSessionCookies=true';
            }

            fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            })

                .then((data) => {
                    // handle success or error from the server
                    if (data.ok) {
                        // Set storage type based on "remember me"
                        userService.setStorage(rememberme);

                        setSuccess('Successful Login.');
                        window.location.href = '/';
                    } else {
                        setError('Error Logging In.');
                    }
                })
                .catch((error) => {
                    // handle network error
                    console.log(error);
                    setError('Network Error');
                });
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: 'auto',
                p: 3,
                mt: 6,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.7)',
            }}
        >
            <Box component="img" src={imageUrl} alt="Login Logo" sx={{ width: '100%', mb: 2, objectFit: 'contain' }} />

            <Typography variant="h5" align="center" gutterBottom>
                Välkommen
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Lösenord"
                    name="password"
                    type="password"
                    value={password}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <FormControlLabel
                    control={<Checkbox name="rememberme" checked={rememberme} onChange={handleChange} />}
                    label="Kom ihåg mig"
                />
                <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2}>
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Logga in
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleRegisterClick} fullWidth>
                        Registrera dig
                    </Button>
                </Box>
            </form>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity='success' sx={{ mt: 2 }}>{success}</Alert>}
        </Box>
    );
}

export default Login;
