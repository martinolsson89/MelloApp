import { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, CardHeader, List, ListItem, ListItemText, Divider } from '@mui/material';
import Navbar from "../components/Navbar.tsx";
import AuthorizeView from "../components/AuthorizeView.tsx";


// Define types for SubCompetition and Artist
interface Artist {
    id: string;
    name: string;
    song: string;
    startingNumber: number;
    subCompetitionId: string;
}

interface SubCompetition {
    id: string;
    name: string;
    date: string;
    location: string;
    artists: Artist[];
}

function Schedule() {
    const [subCompetitions, setSubCompetitions] = useState<SubCompetition[]>([]);

    useEffect(() => {
        // Fetch GET data from the backend
        // ('/SubCompetition/GetSubCompetitionsWithArtists')

        async function fetchSubCompetitions() {
            try {
                let response = await fetch('/SubCompetition/GetSubCompetitionsWithArtists');
                if (response.status === 200) {
                    let data = await response.json();
                    setSubCompetitions(data);
                } else {
                    throw new Error('Error fetching data');
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchSubCompetitions();

    }, []);

    return (
        <AuthorizeView>
            <Navbar />
            <Box sx={{
                mt: 4, textAlign: 'center',
                mx: 'auto',
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.7)'
            }}>
                <Typography variant="h4" sx={{mb:4, fontWeight:'bold'}}>
                    Tävlingsschema
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row', lg: 'row'},
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                    gap: 4, // Adds space between the cards
                }}>
                {/* Display each subCompetition */}
                    {subCompetitions.map((subCompetition) => (
                        <Card key={subCompetition.id} sx={{ mb: 4, minWidth: {xs: 300, md: 350, lg: 500}  }}>
                        <CardHeader
                            title={subCompetition.name}
                                subheader={`${new Date(subCompetition.date)
                                    .toISOString()
                                    .replace('T', ' ')
                                    .slice(0, 11)} 20:00 - ${subCompetition.location}`}
                        />
                        <CardContent>
                            <Typography variant="h6">Bidrag:</Typography>
                            <List>
                                {subCompetition.artists.map((artist) => (
                                    <div key={artist.id}>
                                        <ListItem sx={{textAlign: 'center'}}>
                                            <ListItemText
                                                primary={`${artist.startingNumber}. ${artist.song}`}
                                                secondary={`Artist: ${artist.name}`}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </div>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                ))}
                </Box>
            </Box>
        </AuthorizeView>
    );
}

export default Schedule;
