
import React, { useEffect, useState } from 'react';
import { Container, Grid, CircularProgress, TextField, Button, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PreviewCard from '../Components/PreviewCard';

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
  genres: number[];
}

interface ApiShow {
  id: string;
  image: string;
  title: string;
  description: string;
  updated: string;
  genres: number[];
}

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
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("asc");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app/shows');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: ApiShow[] = await response.json();
        const formattedData: Show[] = data.map((show) => ({
          id: show.id,
          image: show.image,
          title: show.title,
          description: show.description,
          updated: show.updated,
          genres: show.genres,
        }));
        setShows(formattedData);
      } catch (error) {
        setError('Failed to load shows. Please try again later.');
        console.error('Error fetching shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredShows = shows.filter((show) => {
    const titleMatch = show.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const genreMatch = show.genres.some(genreId =>
      genreMapping[genreId]?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const letterMatch = selectedLetter ? show.title[0].toLowerCase() === selectedLetter.toLowerCase() : true;

    return (titleMatch || genreMatch) && letterMatch;
  });

  const sortedShows = filteredShows.sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    return sortOrder === "asc" ? (titleA < titleB ? -1 : titleA > titleB ? 1 : 0) : (titleA > titleB ? -1 : titleA < titleB ? 1 : 0);
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOpenShowClick = (id: string) => {
    navigate(`/shows/${id}`); // Navigate to the show detail page
  };

  // function to toggle favorites
  const onToggleFavorite = (showId: string): Promise<void> => {
    return new Promise((resolve) => {
      setFavorites((prevFavorites) => {
        const updatedFavorites = prevFavorites.includes(showId)
          ? prevFavorites.filter(id => id !== showId) // Removes from favorites
          : [...prevFavorites, showId]; // Add to favorites

        // If show was added to favorites, display snackbar
        if (!prevFavorites.includes(showId)) {
          setSnackbarOpen(true); // Open snackbar notification
        }

        resolve(); // Resolve the promise
        return updatedFavorites;
      });
    });
  };

  if (loading) {
    return (
      <StyledContainer>
        <CircularProgress />
        <p>Loading shows...</p>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      {error && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={error}
        />
      )}
      <TextField
        fullWidth
        variant="outlined"
        label="Search by Title or Genre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      <div>
        {[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(letter => (
          <Button
            key={letter}
            variant="outlined"
            onClick={() => setSelectedLetter(letter)}
            style={{ margin: '0 5px' }}
          >
            {letter}
          </Button>
        ))}
        <Button
          variant="outlined"
          onClick={() => {
            setSelectedLetter(null);
            setSearchTerm(''); // Clear search term when clearing letter filter
          }}
          style={{ marginLeft: '10px' }}
        >
          Clear Filter
        </Button>
      </div>
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
                  genres: show.genres.map((id) => genreMapping[id]).filter(Boolean)
                }}
                isFavorite={favorites.includes(show.id)} // Check if this show is a favorite
                onToggleFavorite={() => onToggleFavorite(show.id)} // Pass the toggle function
              />
              {/* Added Open Show button */}
              <Button 
                onClick={() => handleOpenShowClick(show.id)} 
                variant="contained" 
                color="primary" 
                style={{ marginTop: '10px' }}
              >
                Open Show
              </Button>
            </Grid>
          ))
        ) : (
          <p>No shows found.</p>
        )}
      </Grid>
    </StyledContainer>
  );
};

export default HomePage;
