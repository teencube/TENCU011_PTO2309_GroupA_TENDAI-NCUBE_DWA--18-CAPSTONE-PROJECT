import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { CircularProgress, Box } from '@mui/material';


const Container = styled.div`
  padding: 20px;
`;

const ShowTitle = styled.h1`
  font-size: 2.5em;
  margin-bottom: 10px;
`;

const ShowImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const ShowDescription = styled.p`
  font-size: 1.1em;
  color: #555;
  margin-bottom: 20px;
`;

const SeasonTitle = styled.h2`
  cursor: pointer;
  font-size: 2em;
  color: #0077cc;
  margin: 15px 0;
  &:hover {
    text-decoration: underline;
  }
`;

const EpisodeList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const EpisodeItem = styled.li`
  margin: 10px 0;
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

const EpisodeTitle = styled.h3`
  cursor: pointer;
  color: #0077cc;
  margin: 5px 0;
  &:hover {
    text-decoration: underline;
  }
`;

const NowPlayingTitle = styled.h3`
  margin-top: 20px;
  color: #333;
`;

// TypeScript Interfaces
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

// ShowPage Component
const ShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    const fetchShow = async () => {
      setError(null);
      if (!id || isNaN(Number(id))) {
        setError('Invalid Show ID');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!response.ok) {
          const message = response.status === 404 ? 'Show not found' : 'Failed to fetch show details';
          setError(message);
          return;
        }
        const data = await response.json();
        setShow(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError('Failed to load show details. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  const handleSeasonClick = (seasonId: string) => {
    setSelectedSeasonId((prev) => (prev === seasonId ? null : seasonId));
    setSelectedEpisode(null);
  };

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <p>Please wait, loading show details...</p>
      </Box>
    );
  }

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!show) return <p>Show not found</p>;

  return (
    <Container>
      <ShowTitle>{show.title}</ShowTitle>
      <ShowImage src={show.image} alt={`Cover image of ${show.title}`} />
      <ShowDescription>{show.description}</ShowDescription>
      <p><strong>Seasons:</strong> {show.seasons.length}</p>

      {show.seasons.length === 0 ? (
        <p>No seasons available for this show. Please check back later!</p>
      ) : (
        show.seasons.map((season) => (
          <div key={season.id}>
            <SeasonTitle onClick={() => handleSeasonClick(season.id)}>
              {season.title}
            </SeasonTitle>
            {selectedSeasonId === season.id && (
              <EpisodeList>
                {season.episodes.map((episode, episodeIndex) => (
                  <EpisodeItem key={episodeIndex}>
                    <EpisodeTitle onClick={() => handleEpisodeClick(episode)}>
                      {episode.title}
                    </EpisodeTitle>
                    <p>{episode.description}</p>
                    <audio controls>
                      <source src={episode.file} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </EpisodeItem>
                ))}
              </EpisodeList>
            )}
          </div>
        ))
      )}

      {selectedEpisode && (
        <div>
          <NowPlayingTitle>Now Playing: {selectedEpisode.title}</NowPlayingTitle>
          <audio controls autoPlay>
            <source src={selectedEpisode.file} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </Container>
  );
};

export default ShowPage;
