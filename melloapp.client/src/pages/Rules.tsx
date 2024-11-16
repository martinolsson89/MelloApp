import { Typography, Box, Divider, Button } from '@mui/material';
import AuthorizeView from "../components/AuthorizeView.tsx";
import Navbar from "../components/Navbar.tsx";
import { useNavigate } from 'react-router-dom';

function Rules() {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <AuthorizeView>
            <Navbar />
            <Box sx={{
                mt: 4,
                mx: 'auto',
                p: { xs: 2, md: 4 },
                maxWidth: { xs: '90%', md: '60%' },
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center'
            }}>
                <Typography variant="h4" gutterBottom>
                    Regler & Information
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Vanliga frågor:
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2, textDecoration: 'underline' }}>
                    <span style={{ fontWeight: 'bold' }}>Vart lämnar jag in mitt tips?</span>
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                    <span style={{ fontWeight: 'bold' }}>Svar:</span> Du klickar antingen på <span style={{ fontWeight: 'bold' }}><Button onClick={() => handleNavigation('/bet')}> Rösta </Button></span> här eller i menyn. Där du kan fylla i ditt tips och skicka in det.
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2, textDecoration: 'underline' }}>
                    <span style={{ fontWeight: 'bold' }}>Hur gör jag för att tippa?</span>
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                    <span style={{ fontWeight: 'bold' }}>Svar:</span> När du klickat dig in på röstningsidan ser du en lista med alla deltävlingar och bidrag. Du väljer i rullistan vilket alternativ du tippar på (Final, Kvalfinal, Åker ut).
                    Längst ner väljer du vilken artist/låt som kommer vinna resp. komma tvåa i finalen. När du är nöjd klickar du på knappen: <span style={{ fontWeight: 'bold' }}>Skicka in tips</span>, klart!
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2, textDecoration: 'underline' }}>
                    <span style={{ fontWeight: 'bold' }}>Vart ser jag hur de andra i släkten har tippat?</span>
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                    <span style={{ fontWeight: 'bold' }}>Svar:</span> Du klickar antingen på <span style={{ fontWeight: 'bold' }}><Button onClick={() => handleNavigation('/bet-overview')}> Tipshörnan </Button></span> här eller i menyn. Det är dock oklart om det hjälper dig...
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2, textDecoration: 'underline' }}>
                    <span style={{ fontWeight: 'bold' }}>När stänger tippningen?</span>
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                    <span style={{ fontWeight: 'bold' }}>Svar:</span> Du kan tippa fram till till och med <span style={{ fontWeight: 'bold' }}>31 januari.</span>
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2, textDecoration: 'underline' }}>
                    <span style={{ fontWeight: 'bold' }}>Kan jag ändra mitt tips?</span>
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                    <span style={{ fontWeight: 'bold' }}>Svar:</span> Nej, När du skickat in ditt tips kan du inte ändra det.
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2, textDecoration: 'underline' }}>
                    <span style={{ fontWeight: 'bold' }}>Hur lägger jag till en egen profilbild?</span>
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                    <span style={{ fontWeight: 'bold' }}>Svar:</span> Du klickar antingen på <span style={{ fontWeight: 'bold' }}><Button onClick={() => handleNavigation('/my-account')}> Mitt konto </Button></span> här eller i menyn. Där kan du klistra in en länk till en bild från nätet.
                </Typography>

                
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Regler:
                </Typography>

                <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                    • Välj <span style={{ fontWeight: 'bold' }}>2 artister/låtar</span> som du tror går direkt till <span style={{ fontWeight: 'bold' }}>Finalen</span> i varje delfinal.
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                    • Välj <span style={{ fontWeight: 'bold' }}>2 artister/låtar</span> som du tror går direkt till <span style={{ fontWeight: 'bold' }}>Finalkvalet</span> i varje delfinal.
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                    • Välj <span style={{ fontWeight: 'bold' }}>2 artister/låtar</span> som kommer <span style={{ fontWeight: 'bold' }}>Åka Ut</span> i varje delfinal.
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                    • Välj den <span style={{ fontWeight: 'bold' }}>artist/låt</span> som du tror kommer vinna hela Svenska Melodifestivalen i <span style={{ fontWeight: 'bold' }}>Finalen</span> den 8/3
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 4 }}>
                    • Välj den <span style={{ fontWeight: 'bold' }}>artist/låt</span> som du tror kommer att komma <span style={{ fontWeight: 'bold' }}>tvåa i Finalen</span> den 8/3
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Poäng:
                </Typography>

                <Typography variant="body1" align="left" sx={{ mb: 1 }}>
                    • För varje rätt <span style={{ fontWeight: 'bold' }}>Final</span>, får du <span style={{ fontWeight: 'bold' }}>5 poäng</span>
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 1 }}>
                    • För varje rätt <span style={{ fontWeight: 'bold' }}>FinalKval</span>, får du <span style={{ fontWeight: 'bold' }}>3 poäng</span>
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 1 }}>
                    • För varje rätt <span style={{ fontWeight: 'bold' }}>Åker ut</span>, får du <span style={{ fontWeight: 'bold' }}>1 poäng</span>
                </Typography>
                <Typography variant="body1" align="left" sx={{ mb: 1 }}>
                    • För den rätta artist/låt som <span style={{ fontWeight: 'bold' }}>vinner i finalen</span> den 8/3, får du <span style={{ fontWeight: 'bold' }}>10 poäng</span>
                </Typography>
                <Typography variant="body1" align="left">
                    • För den rätta artist/låt som <span style={{ fontWeight: 'bold' }}>kommer tvåa i finalen</span> den 8/3, får du <span style={{ fontWeight: 'bold' }}>8 poäng</span>
                </Typography>
            </Box>
        </AuthorizeView>
    );
}

export default Rules;

