import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import styled from 'styled-components';


const CardContainer = styled(Card)`
  max-width: 200px; /* Reduced width */
  margin: 10px;
  background: linear-gradient(135deg, #3a3a3a, #1e1e1e); /* Darker gradient background */
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
  height: 150px; /* Adjust height if needed */
  object-fit: cover; /* Ensure image covers the media area */
  width: 100%;
`;

const CustomCardContent = styled(CardContent)`
  background: rgba(0, 0, 0, 0.8); /* Darker translucent background */
  padding: 16px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #e0e0e0; /* Light text color for contrast */
  text-align: center; /* Center align text */
`;


interface Show {
  id: string;
  image: string;
  title: string;
}


const API_URL = 'https://podcast-api.netlify.app/shows';

const PodshowsDisplay: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
// useEffect hook to fetch shows when the component mounts
  useEffect(() => {
    const loadShows = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        //Maping through data to structure it according to our Show Interface
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
  }, []);//ensures that effect runs  only once on mount

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
        <CardContainer key={show.id}>
          <CustomCardMedia
            src={show.image}
            alt={show.title}
          />
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
