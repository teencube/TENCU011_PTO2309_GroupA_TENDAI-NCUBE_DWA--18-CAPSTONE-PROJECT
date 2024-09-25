import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: red;
  font-weight: bold;
  margin: 20px 0;
`;

interface Episode {
  title: string;
  description: string;
  episode: number;
  file: string;
}

interface Season {
  id: string; 
  title: string;
  episodes: Episode[]; 
}

interface Show {
  id: number;
  title: string;
  description: string;
  image: string;
  seasons: Season[];
}

const ShowsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<Show>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);

  useEffect(() => {
    const fetchShow = async () => {
      setError(null);
      if (!id) {
        setError('Show ID is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!response.ok) {
          throw new Error('Error fetching show details');
        }
        const data = await response.json();
        setShow(data); 
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load show details');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  const handleSeasonClick = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!show) return <div>Show not found</div>;

  return (
    <Container>
      <h1>{show.title}</h1>
      <img src={show.image} alt={show.title} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
      <p>{show.description}</p>
      <p><strong>Seasons:</strong> {show.seasons.length}</p>

      {show.seasons.map((season) => (
        <div key={season.id}>
          <h2 style={{ cursor: 'pointer' }} onClick={() => handleSeasonClick(season.id)}>
            {season.title}
          </h2>
          {selectedSeasonId === season.id && season.episodes.length > 0 && (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {season.episodes.map((episode, episodeIndex) => (
                <li key={episodeIndex}>
                  <h3>{episode.title}</h3>
                  <p>{episode.description}</p>
                  <audio controls>
                    <source src={episode.file} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </Container>
  );
};

export default ShowsPage;
