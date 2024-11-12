import { Typography, Box} from '@mui/material';
import AuthorizeView, { AuthorizedUser } from "../components/AuthorizeView.tsx";
import Navbar from "../components/Navbar.tsx";

function Home() {

    return (
        <AuthorizeView>
           <Navbar />
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
