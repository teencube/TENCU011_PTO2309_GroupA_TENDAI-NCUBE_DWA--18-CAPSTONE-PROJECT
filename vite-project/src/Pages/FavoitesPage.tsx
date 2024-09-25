import React, { useState, useEffect } from 'react'; 
import PreviewCard from '../Components/PreviewCard'; 
import useAuth from '../Components/useAuth'; 
import supabase from '../SupabaseClient'; 
import { Button, Snackbar, CircularProgress } from '@mui/material'; 
import styled from 'styled-components'; 
import { Link } from 'react-router-dom'; 

interface Show {
  id: string; 
  image: string; 
  title: string; 
  description: string; 
  updated: string; 
  genres: string[]; 
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

const ActionButton = styled(Button)`
  position: absolute; 
  top: 10px;
  right: 10px;
  background-color: #e91e63; 
  color: white;
  &:hover {
    background-color: #c2185b; 
  }
`;

const ShareButton = styled(ActionButton)`
  top: 40px; 
  background-color: #2196f3; 
  &:hover {
    background-color: #1976d2; 
  }
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

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', user.id); // Ensure this matches your database

          if (error) throw new Error(error.message);

          const updatedData: Show[] = data.map(show => ({
            id: show.id, // Make sure these keys match your database
            image: show.image, 
            title: show.title, 
            description: show.description, 
            updated: show.updated || new Date().toISOString(), 
            genres: show.genres, // Ensure genres is included if present in your database
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

  const handleDeleteFavorite = async (showId: string) => {
    if (!user?.id) {
      alert('You must be logged in to delete favorites.'); 
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('show_id', showId); // Make sure 'show_id' matches your database

      if (error) {
        throw new Error(error.message); 
      }

      const updatedFavorites = favorites.filter(show => show.id !== showId);
      setFavorites(updatedFavorites);
      setSnackbarMessage('Favorite removed successfully.'); 
      setSnackbarOpen(true); 
    } catch (error) {
      console.error('Error deleting favorite:', error); 
      setSnackbarMessage('Error removing favorite. Please try again later.'); 
      setSnackbarOpen(true); 
    }
  };

  const handleShareFavorite = (show: Show) => {
    const url = `https://podcast-api.netlify.app/shows/${show.id}`; 
    navigator.clipboard.writeText(url); 
    setSnackbarMessage('URL copied to clipboard: ' + url); 
    setSnackbarOpen(true); 
  };

  const handleSnackbarClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return; 
    }
    setSnackbarOpen(false); 
  };

  if (!user) {
    return <div>Please log in to view your favorites.</div>;
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
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Title>Favorites</Title>
      <ShowGrid>
        {favorites.length > 0 ? (
          favorites.map(show => (
            <div key={show.id} style={{ position: 'relative' }}>
              <PreviewCard 
                show={show} 
                onDelete={handleDeleteFavorite} 
                onShare={handleShareFavorite} 
              />
              <ActionButton onClick={() => handleDeleteFavorite(show.id)} aria-label={`Delete ${show.title}`}>Delete</ActionButton>
              <ShareButton onClick={() => handleShareFavorite(show)} aria-label={`Share ${show.title}`}>Share</ShareButton>
            </div>
          ))
        ) : (
          <EmptyFavoritesMessage>
            No favorites found. <Link to="/">Browse shows</Link>
          </EmptyFavoritesMessage>
        )}
      </ShowGrid>
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
