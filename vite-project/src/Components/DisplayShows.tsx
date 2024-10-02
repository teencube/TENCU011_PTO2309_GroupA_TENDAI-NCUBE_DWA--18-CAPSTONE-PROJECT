import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Snackbar, Alert, Button } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useAuth from '../Components/useAuth';

const CardContainer = styled(Card)`
  max-width: 200px;
  margin: 10px;
  background: linear-gradient(135deg, #3a3a3a, #1e1e1e);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.9);
  }
`;

const CustomCardMedia = styled('img')`
  height: 150px;
  object-fit: cover;
  width: 100%;
`;

const CustomCardContent = styled(CardContent)`
  background: rgba(0, 0, 0, 0.8);
  padding: 16px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #e0e0e0;
  text-align: center;
`;

interface Show {
  id: string;
  image: string;
  title: string;
}

const API_URL = 'https://podcast-api.netlify.app/shows'; // Corrected endpoint

const PodshowsDisplay: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar visibility
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadShows = async () => {
      try {
        const response: Response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data: Show[] = await response.json(); 

        setShows(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(`Failed to load shows: ${error.message}`);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadShows();
  }, []);

  const handleShowClick = (id: string) => {
    if (!user) {
      setSnackbarOpen(true); // Shows Snackbar if user is not authenticated
    } else {
      navigate(`/shows/${id}`); // Redirects to the show page if authenticated
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleLogin = () => {
    navigate('/login'); // Navigates to login page
    handleSnackbarClose(); // Closes Snackbar
  };

  const handleSignup = () => {
    navigate('/signup'); // Navigates to signup page
    handleSnackbarClose(); // Closes Snackbar
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #2e2e2e, #1a1a1a)',
        padding: '20px',
        minHeight: '100vh',
      }}
    >
      {shows.map((show) => (
        <CardContainer key={show.id} onClick={() => handleShowClick(show.id)}>
          <CustomCardMedia src={show.image} alt={show.title} />
          <CustomCardContent>
            <Typography variant="h6" component="div">
              {show.title}
            </Typography>
          </CustomCardContent>
        </CardContainer>
      ))}

    
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="warning" 
          sx={{ width: '100%' }}
          action={
            <div>
              <Button color="inherit" onClick={handleLogin}>
                Login
              </Button>
              <Button color="inherit" onClick={handleSignup}>
                Sign Up
              </Button>
            </div>
          }
        >
          Please log in or sign up to view show details!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PodshowsDisplay;
