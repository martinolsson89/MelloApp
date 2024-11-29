import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';;
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/UserService';

// Define enums and types
enum ePlacement {
  Final = 'Final',
  FinalKval = 'FinalKval',
  ÅkerUt = 'ÅkerUt',
}

enum eFinalPlacement {
  Vinnare = 'Vinnare',
  Tvåa = 'Tvåa',
}

interface Artist {
  id: string;
  name: string;
  song: string;
  startingNumber: number;
}

interface Result {
  id: string;
  placement: string;
  finalPlacement?: string;
  artist: Artist;
  subCompetitionId: string;
}

interface SubCompetition {
  id: string;
  name: string;
  date: string;
  location: string;
  results: Result[];
}

const ResultsManagement: React.FC = () => {
  const [subCompetitions, setSubCompetitions] = useState<SubCompetition[]>([]);
  const [editResultId, setEditResultId] = useState<string>('');
  const [newResult, setNewResult] = useState({
    placement: '',
    finalPlacement: '',
    artistId: '',
    subCompetitionId: '',
  });
  const IsAdmin = userService.isAdmin();

  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Prepare options from enums
  const placementOptions = Object.values(ePlacement);
  const finalPlacementOptions = Object.values(eFinalPlacement);

  // Fetch Sub Competitions with Results
  const fetchSubCompetitionsWithResults = async () => {
    try {
      const response = await fetch('/SubCompetition/GetSubCompetitionWithResult');
      if (!response.ok) {
        throw new Error('Failed to fetch sub-competitions with results');
      }
      const data = await response.json();

      // Map over data to ensure each result has subCompetitionId
      const subCompetitionsWithIds = data.map((subCompetition: SubCompetition) => ({
        ...subCompetition,
        results: subCompetition.results.map((result) => ({
          ...result,
          subCompetitionId: subCompetition.id,
        })),
      }));
      setSubCompetitions(subCompetitionsWithIds);
    } catch (error) {
      console.error('Error fetching sub-competitions with results:', error);
    }
  };

  // Add a New Result
  const addResult = async () => {
    const { placement, finalPlacement, artistId, subCompetitionId } = newResult;

    if (!placement || !artistId || !subCompetitionId) {
      alert('Please fill in all required fields before adding.');
      return;
    }

    const result = finalPlacement
      ? { placement, finalPlacement, artistId, subCompetitionId }
      : { placement, artistId, subCompetitionId };

    try {
      const response = await fetch('/ResultOfSubCompetition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
      if (!response.ok) {
        throw new Error('Failed to add result');
      }
      // Reset the form fields
      setNewResult({ placement: '', finalPlacement: '', artistId: '', subCompetitionId: '' });
      fetchSubCompetitionsWithResults();
    } catch (error) {
      console.error('Error adding result:', error);
    }
  };

  // Update an Existing Result
  const updateResult = async () => {
    // Find the updated result
    const updatedResult = subCompetitions
      .flatMap((sc) => sc.results)
      .find((res) => res.id === editResultId);

    if (!updatedResult) {
      alert('Result not found.');
      return;
    }

    const { id, placement, finalPlacement, artist, subCompetitionId } = updatedResult;
    const artistId = artist.id;

    if (!placement || !artistId || !subCompetitionId) {
      alert(`Please fill in all required fields before saving. 
      placement: ${placement}, artist Id: ${artistId}, sub competition Id ${subCompetitionId}`);
      return;
    }

    try {
      await fetch(`/ResultOfSubCompetition/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, placement, finalPlacement, artistId, subCompetitionId }),
      });
      setEditResultId('');
      fetchSubCompetitionsWithResults(); // Refresh data
      alert("Update successful!")
    } catch (error) {
      console.error('Error updating result:', error);
    }
  };

  // Delete a Result
  const deleteResult = async (id: string) => {
    try {
      const response = await fetch(`/ResultOfSubCompetition/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete result');
      }
      fetchSubCompetitionsWithResults();
    } catch (error) {
      console.error('Error deleting result:', error);
    }
  };

  // Handle changes to the result during editing
  const handleResultChange = (field: string, value: string) => {
    setSubCompetitions((prevSubCompetitions) =>
      prevSubCompetitions.map((subCompetition) => ({
        ...subCompetition,
        results: subCompetition.results.map((result) => {
          if (result.id === editResultId) {
            if (field.startsWith('artist.')) {
              const artistField = field.split('.')[1];
              return {
                ...result,
                artist: {
                  ...result.artist,
                  [artistField]: value,
                },
              };
            } else {
              return {
                ...result,
                [field]: value,
              };
            }
          }
          return result;
        }),
      }))
    );
  };

  // Load data on component mount
  useEffect(() => {
    fetchSubCompetitionsWithResults();
  }, []);

  return (
    IsAdmin && (
      <>
        <Navbar />
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            my: 4,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Results Management
          </Typography>

          {/* Add Result Form */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add Result
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Placement</InputLabel>
                  <Select
                    label="Placement"
                    value={newResult.placement}
                    onChange={(e) =>
                      setNewResult({ ...newResult, placement: e.target.value })
                    }
                  >
                    {placementOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Final Placement</InputLabel>
                  <Select
                    label="Final Placement"
                    value={newResult.finalPlacement || ''}
                    onChange={(e) =>
                      setNewResult({ ...newResult, finalPlacement: e.target.value })
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {finalPlacementOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Artist ID"
                  value={newResult.artistId}
                  onChange={(e) =>
                    setNewResult({ ...newResult, artistId: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Sub Competition ID"
                  value={newResult.subCompetitionId}
                  onChange={(e) =>
                    setNewResult({ ...newResult, subCompetitionId: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={addResult}>
                  Add Result
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Sub-Competitions with Results Table */}
          {subCompetitions.map((subCompetition) => (
            <Box key={subCompetition.id} sx={{ mb: 4 }}>
              {/* ... (subCompetition details) */}
              <Typography variant="h6" gutterBottom>
                {subCompetition.name} ({new Date(subCompetition.date).toLocaleString()})
              </Typography>
              <Typography variant="body1" gutterBottom>
                Location: {subCompetition.location}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                SubCompetition ID: {subCompetition.id}
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Placement</TableCell>
                      <TableCell>Final Placement</TableCell>
                      <TableCell>Artist ID</TableCell>
                      <TableCell>Artist Name</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subCompetition.results.map((result) => (
                      <TableRow key={result.id}>
                        {editResultId === result.id ? (
                          <>
                            {/* Placement */}
                            <TableCell>
                              <FormControl fullWidth>
                                <InputLabel>Placement</InputLabel>
                                <Select
                                  label="Placement"
                                  value={result.placement}
                                  onChange={(e) =>
                                    handleResultChange('placement', e.target.value)
                                  }
                                >
                                  {placementOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                            {/* Final Placement */}
                            <TableCell>
                              <FormControl fullWidth>
                                <InputLabel>Final Placement</InputLabel>
                                <Select
                                  label="Final Placement"
                                  value={result.finalPlacement || ''}
                                  onChange={(e) =>
                                    handleResultChange('finalPlacement', e.target.value)
                                  }
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  {finalPlacementOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                            {/* Artist ID */}
                            <TableCell>
                              <TextField
                                label="Artist ID"
                                value={result.artist.id}
                                onChange={(e) =>
                                  handleResultChange('artist.id', e.target.value)
                                }
                                fullWidth
                              />
                            </TableCell>
                            {/* Artist Name */}
                            <TableCell>
                              {result.artist.name || ''}
                            </TableCell>
                            {/* Actions */}
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={updateResult}
                                sx={{ mr: 1 }}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => setEditResultId('')}
                              >
                                Cancel
                              </Button>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            {/* Display fields when not editing */}
                            <TableCell>{result.placement}</TableCell>
                            <TableCell>{result.finalPlacement}</TableCell>
                            <TableCell>{result.artist.id}</TableCell>
                            <TableCell>{result.artist.name}</TableCell>
                            <TableCell>
                              <IconButton
                                color="primary"
                                onClick={() => {
                                  setEditResultId(result.id);
                                }}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                color="secondary"
                                onClick={() => deleteResult(result.id)}
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
          <Button variant="contained" color="secondary" sx={{ m: 2 }} onClick={() => handleNavigation('/admin-center')}>
            Go Back
          </Button>
        </Box>
      </>
    )
  );
};

export default ResultsManagement;
