import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Snackbar from '@mui/material/Snackbar';
import supabase from '../SupabaseClient';
import PreviewCard from '../Components/PreviewCard';
import useAuth from '../Components/useAuth'; 

interface Show {
  id: string;
  image: string;
  title: string;
  description: string;
  updated: string;
  genres: string[];
}

// Styled components for Favorites Page
const FavoritesContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f4f4f9;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
`;

const EmptyMessage = styled.p`
  font-size: 1.5rem;
  color: #999;
  margin-top: 50px;
`;

const LoadingMessage = styled.div`
  font-size: 1.5rem;
  color: #007bff;
  text-align: center;
  margin-top: 50px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 1.5rem;
  margin-top: 50px;
  text-align: center;
`;

const FavoritesPage = () => {
  const { user } = useAuth(); // Gets authorized user
  const [favorites, setFavorites] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch favorites from Supabase
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return; // If user is null, do nothing.
      }

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user-id', user.id); // Kept key name as user-id

        if (error) throw new Error(error.message);

        const updatedData: Show[] = data.map((show) => ({
          id: show['show-id'], // Kept key name as show-id
          image: show.image,
          title: show.title,
          description: show.description,
          updated: show.updated || new Date().toISOString(),
          genres: show.genres || [],
        }));

        setFavorites(updatedData);
      } catch (err) {
        const errorMessage =
          (err as Error).message || 'Error fetching favorites. Please try again later.';
        setError(errorMessage);
        setSnackbarMessage('Failed to load favorites.');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleToggleFavorite = async (showId: string) => {
    if (!user) {
      setSnackbarMessage('Please log in to manage favorites.');
      setSnackbarOpen(true);
      return;
    }

    const isAlreadyFavorite = favorites.some((favorite) => favorite.id === showId);

    try {
      if (isAlreadyFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user-id', user.id) // Kept key name as user-id
          .eq('show-id', showId); // Kept key name as show-id

        if (error) throw new Error(error.message);

        setFavorites(favorites.filter((fav) => fav.id !== showId));
        setSnackbarMessage('Removed from favorites.');
      } else {
        // Add to favorites
        const newFavorite = favorites.find((show) => show.id === showId);

        if (newFavorite) {
          const { error } = await supabase
            .from('favorites')
            .insert([{ 'user-id': user.id, 'show-id': newFavorite.id }]); // Kept key names

          if (error) throw new Error(error.message);

          setFavorites([...favorites, newFavorite]);
          setSnackbarMessage('Added to favorites.');
        }
      }

      setSnackbarOpen(true);
    } catch (err) {
      const errorMessage =
        (err as Error).message || 'Error updating favorites. Please try again later.';
      setError(errorMessage);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle loading and error states
  if (loading) return <LoadingMessage>Loading favorites...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <FavoritesContainer>
      <Title>Your Favorite Shows</Title>
      {favorites.length === 0 ? (
        <EmptyMessage>No favorite shows added yet.</EmptyMessage>
      ) : (
        <CardGrid>
          {favorites.map((show) => (
            <PreviewCard
              key={show.id}
              show={show}
              isFavorite={favorites.some((fav) => fav.id === show.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </CardGrid>
      )}

      {/* Snackbar to show messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </FavoritesContainer>
  );
};

export default FavoritesPage;
