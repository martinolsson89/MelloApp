import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import LogoutLink from '../components/LogoutLink';
import AuthorizeView, { AuthorizedUser } from "../components/AuthorizeView.tsx";
import leoAvatar from '../assets/avatar/leo.jpg'; 

function Home() {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null); // Updated type here
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
        setMenuAnchor(null); // Close the menu after navigation
    };

    const handleMenuOpen = (event : React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const navItems = [
        { label: 'Start', path: '/home' },
        { label: 'Rösta', path: '/bet' },
        { label: 'Ledartavla', path: '/leaderboard' },
        { label: 'Mitt konto', path: '/my-account' },
    ];

    return (
        <AuthorizeView>
            <AppBar position="static" sx={{ backgroundColor: 'rgba(246, 66, 173, 0.7)' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1}}>
                       Släktkampen 2025
                    </Typography>
                    {/* Desktop Navigation */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {navItems.map((item) => (
                            <Button key={item.label} color="inherit" onClick={() => handleNavigation(item.path)}>
                                {item.label}
                            </Button>
                        ))}
                        <Avatar alt="Remy Sharp" src={leoAvatar} />
                        <LogoutLink>
                            <Button color="inherit">Logga ut</Button>
                        </LogoutLink>
                    </Box>

                    {/* Mobile Navigation Menu Icon */}
                    <IconButton
                        color="inherit"
                        edge="end"
                        onClick={handleMenuOpen}
                        sx={{ display: { xs: 'flex', md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Mobile Menu */}
                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        {navItems.map((item) => (
                            <MenuItem key={item.label} onClick={() => handleNavigation(item.path)}>
                                {item.label}
                            </MenuItem>
                        ))}
                        <MenuItem onClick={handleMenuClose}>
                            <LogoutLink>
                                <Button color="inherit">Logga ut</Button>
                            </LogoutLink>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box sx={{
                mt: 4, textAlign: 'center', maxWidth: 400,
                mx: 'auto',
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.7)' }}>
                <Typography variant="h4" gutterBottom>
                    Välkommen!
                </Typography>
                <Typography variant="subtitle1">
                    Du är nu inloggad som användare: <AuthorizedUser value="email" />.
                </Typography>
            </Box>
        </AuthorizeView>
    );
}

export default Home;
