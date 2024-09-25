
import React, { useEffect, useState } from 'react';
import { Container, Grid, CircularProgress, TextField, Snackbar, Button } from '@mui/material';
import styled from 'styled-components';
import PreviewCard from '../Components/PreviewCard';
import useAuth from '../Components/useAuth';
import supabase from '../SupabaseClient';

const StyledContainer = styled(Container)`
  padding: 20px;
  background: #1b1f36;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
`;

interface Show {
  id: string;
  image: string;
  title: string;
  description: string;
  updated: string;
  genres: number[]; // Keep genres as numbers (IDs) for the API response
}

interface ApiShow {
  id: string;
  image: string;
  title: string;
  description: string;
  updated: string;
  genres: number[];
}

// Genre mapping object
const genreMapping: Record<number, string> = {
  1: 'Personal Growth',
  2: 'True Crime and Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family',
};

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("asc");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Fetch shows from the API
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app/shows');
        const data: ApiShow[] = await response.json();
        const formattedData: Show[] = data.map((show) => ({
          id: show.id,
          image: show.image,
          title: show.title,
          description: show.description,
          updated: show.updated,
          genres: show.genres, // Retain IDs from the API
        }));

        setShows(formattedData);
      } catch (error) {
        console.error('Error fetching shows:', error);
        setSnackbarMessage('Failed to fetch shows.');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('show_id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setShows((prevShows) => prevShows.filter((show) => show.id !== id));
      setSnackbarMessage('Show removed from favorites.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting show:', error);
      setSnackbarMessage('Failed to remove show.');
      setSnackbarOpen(true);
    }
  };

  const handleShare = (show: Show) => {
    setSnackbarMessage(`Shared ${show.title}!`);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Filter shows by debounced search term (title or genre)
  const filteredShows = shows.filter((show) => {
    // Check if title matches search term
    const titleMatch = show.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    // Check if any genre matches the search term
    const genreMatch = show.genres.some(genreId =>
      genreMapping[genreId]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    return titleMatch || genreMatch;
  });

  // Sort shows based on the selected order
  const sortedShows = filteredShows.sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    return sortOrder === "asc" ? (titleA < titleB ? -1 : titleA > titleB ? 1 : 0) : (titleA > titleB ? -1 : titleA < titleB ? 1 : 0);
  });

  if (loading) {
    return (
      <StyledContainer>
        <CircularProgress />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <TextField
        fullWidth
        variant="outlined"
        label="Search by Title or Genre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <Button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} variant="contained" color="primary" style={{ marginBottom: '20px' }}>
        Toggle Sort Order ({sortOrder === "asc" ? "Ascending" : "Descending"})
      </Button>

      <Grid container spacing={2}>
        {sortedShows.length > 0 ? (
          sortedShows.map((show) => (
            <Grid item key={show.id} xs={12} sm={6} md={4}>
              <PreviewCard
                show={{
                  ...show,
                  genres: show.genres.map((id) => genreMapping[id]).filter(Boolean) // Map IDs to titles for display
                }}
                onDelete={() => handleDelete(show.id)}
                onShare={() => handleShare(show)}
              />
            </Grid>
          ))
        ) : (
          <p>No shows found.</p>
        )}
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </StyledContainer>
  );
};

export default HomePage;
