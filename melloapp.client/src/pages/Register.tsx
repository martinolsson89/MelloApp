import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Typography, Button, Box, Alert } from '@mui/material';
function Register() {
    // state variables for email and password
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // state variable for error message
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    }


    // handle change events for input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
         if (name === 'firstName') {
        setFirstName(value);
        } 
         else if (name === 'lastName') {
        setLastName(value);
        } 
          else if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
        }
    };

    // handle submit event for the form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // validate email and password
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError('Fyll i alla fält');
        } else if (password !== confirmPassword) {
            setError('Lösenorden matchar inte varandra');
        } else if (password.length < 6) {
            setError('Lösenordet måste vara minst 6 tecken långt');
        } else if (!email.includes('@')) {
            setError('Ogiltig email');
        }
        else {
            // clear error message
            setError('');
            // post data to the /register api

            fetch("/Account/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                }),
            })

                .then((data) => {
                    // handle success or error from the server
                    console.log(data);
                    if (data.ok) {
                        setError('Successful register.');
                        window.location.href = '/';
                    } else {
                        setError('Error registering.');
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
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 6, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.7)' }}>
            <Typography variant="h5" align="center" gutterBottom>
                Registrera ny användare
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Förnamn"
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Efternamn"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
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
                <TextField
                    fullWidth
                    label="Upprepa lösenord"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2}>
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Registrera dig
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleLoginClick} fullWidth>
                        Gå till logga in
                    </Button>
                </Box>
            </form>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
    );
}

export default Register;