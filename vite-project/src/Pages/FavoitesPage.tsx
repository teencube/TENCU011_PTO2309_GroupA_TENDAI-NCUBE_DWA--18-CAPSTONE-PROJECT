import React, { useState, useEffect } from 'react';
import PreviewCard from '../Components/PreviewCard';
import useAuth from '../Components/useAuth';
import supabase from '../SupabaseClient';
import { Button, Snackbar, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface Show {
  id: string;
  image: string;
  title: string;
  description: string;
  updated: string;
  genres: string[];
  note?: string; // Optional field for notes
}

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const ShowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const EmptyFavoritesMessage = styled.p`
  text-align: center;
  color: #666;
`;

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user.id);

          if (error) throw new Error(error.message);

          const updatedData: Show[] = data.map((show) => ({
            id: show.show_id,
            image: show.image,
            title: show.title,
            description: show.description,
            updated: show.updated || new Date().toISOString(),
            genres: show.genres || [],
            note: show.note || '' // Add note field
          }));

          setFavorites(updatedData);
        } catch (error) {
          setError('Error fetching favorites. Please try again later.');
          console.error('Error fetching favorites:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleAddToFavorites = async (show: Show) => {
    if (!user?.id) {
      alert('You must be logged in to add favorites.');
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: user.id, show_id: show.id, image: show.image, title: show.title, description: show.description, genres: show.genres }]);

      if (error) throw new Error(error.message);

      setFavorites((prevFavorites) => [...prevFavorites, show]);
      setSnackbarMessage('Show added to favorites successfully.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding favorite:', error);
      setSnackbarMessage('Error adding favorite. Please try again later.');
      setSnackbarOpen(true);
    } finally {
      setConfirmationDialogOpen(false);
      setSelectedShow(null);
    }
  };

  const handleSnackbarClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleShowConfirmationDialog = (show: Show) => {
    setSelectedShow(show);
    setConfirmationDialogOpen(true);
  };

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
    setSelectedShow(null);
  };

  if (!user) {
    return (
      <Container>
        <Title>Please log in to view your favorites.</Title>
        <Link to="/">Go back to Home</Link>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <CircularProgress color="secondary" style={{ display: 'block', margin: 'auto' }} />
        <p style={{ textAlign: 'center' }}>Loading favorites...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>Error: {error}</Title>
        <Link to="/">Go back to Home</Link>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Your Favorites</Title>
      <ShowGrid>
        {favorites.length > 0 ? (
          favorites.map((show) => (
            <div key={show.id}>
              <PreviewCard show={show} />
              <Button onClick={() => handleShowConfirmationDialog(show)}>Add to Favorites</Button>
            </div>
          ))
        ) : (
          <EmptyFavoritesMessage>
            No favorites found. <Link to="/">Browse shows</Link>
          </EmptyFavoritesMessage>
        )}
      </ShowGrid>

      <Dialog open={confirmationDialogOpen} onClose={handleCloseConfirmationDialog}>
        <DialogTitle>Confirm Add to Favorites</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to add "{selectedShow?.title}" to your favorites?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => selectedShow && handleAddToFavorites(selectedShow)} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default FavoritesPage;
