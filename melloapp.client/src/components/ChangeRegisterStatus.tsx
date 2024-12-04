import React, { useState, useEffect } from 'react';
import {
    Button, FormControl, InputLabel, MenuItem, Select, Typography, Box
} from '@mui/material';
import Navbar from './Navbar';
import { userService } from '../services/UserService';
import BackButton from './BackButton';

function ChangeRegisterStatus() {
    const [status, setStatus] = useState('true');


    const IsAdmin = userService.isAdmin();

    useEffect(() => {
        // Fetch the registration status
        fetch('/HomeContent/register')
            .then((response) => response.json())
            .then((data) => {
                setStatus(data.isRegistrationEnabled.toString());
            })
            .catch((error) => {
                console.error('Error fetching registration status:', error);
            });
    }, []);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setStatus(event.target.value as string);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const isRegistrationEnabled = status === 'true'; // Convert string back to boolean

        fetch('/HomeContent/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isRegistrationEnabled }),
        })
            .then((res) => res.json())
            .then(() => {
                alert('Registration status updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating registration status:', error);
            });
    };

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
                    }}>
                    <Typography variant="h4" gutterBottom>
                        Change Register Status
                    </Typography>
                    <Typography variant='body1'>
                        Is Register enabled ? {status}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                            <InputLabel id="register-status-label">Register Status</InputLabel>
                            <Select
                                labelId="register-status-label"
                                value={status}
                                onChange={handleChange}
                                label="Register Status"
                            >
                                <MenuItem value="true">True</MenuItem>
                                <MenuItem value="false">False</MenuItem>
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Update
                        </Button>
                    </form>
                    <BackButton />
                </Box>
            </>
        )
    )
}

export default ChangeRegisterStatus