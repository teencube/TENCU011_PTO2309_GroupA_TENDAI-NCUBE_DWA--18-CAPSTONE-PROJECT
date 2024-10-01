import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import useAuth from '../Components/useAuth'; // Hook for authentication

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

const API_URL = 'https://podcast-api.netlify.app/shows/id';

const PodshowsDisplay: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Use navigate for redirection
  const { user } = useAuth(); // Access user from Auth context

  useEffect(() => {
    const loadShows = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const fetchedShows: Show[] = data.map((item: Show) => ({
          id: item.id,
          image: item.image,
          title: item.title,
        }));
        setShows(fetchedShows);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError('Failed to load shows');
      } finally {
        setLoading(false);
      }
    };

    loadShows();
  }, []);

  const handleShowClick = (id: string) => {
    if (!user) {
      // If user is not authenticated, redirect to login/signup
      navigate('/Login'); // Redirect to login page
    } else {
      // If user is authenticated, redirect to the show page
      navigate(`/shows/${id}`);
    }
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
    </div>
  );
};

export default PodshowsDisplay;
