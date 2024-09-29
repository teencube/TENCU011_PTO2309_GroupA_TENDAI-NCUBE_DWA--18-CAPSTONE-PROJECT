import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components for the card
const CardContainer = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  max-width: 350px;
  &:hover {
    transform: scale(1.02);
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 0 auto;
  display: block;
`;

const Title = styled.h2`
  font-size: 18px;
  color: #333;
  margin: 10px 0;
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
  margin: 10px 0;
`;

const Metadata = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const MetadataItem = styled.span`
  font-size: 12px;
  color: #999;
`;

const Genre = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #007BFF;
  margin-top: 5px;
`;

const ActionButton = styled.button`
  background-color: #222;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 15px rgba(0, 0, 0, 0.5);
  margin-top: 10px;

  &:hover {
    background-color: #444;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(0, 0, 0, 0.7);
  }
`;

const SeasonList = styled.div`
  margin-top: 10px;
`;

const SeasonItem = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 5px;
`;

// TypeScript interfaces
interface Season {
  season: number;
  title: string;
  image: string;
  episodes: number;
}

interface Show {
  id: string;
  image: string;
  title: string;
  description: string;
  updated: string;
  genres: string[];
  seasons?: Season[];
  language?: string;
}

interface PreviewCardProps {
  show: Show;
}

// PreviewCard component
const PreviewCard: React.FC<PreviewCardProps> = ({ show }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(prev => !prev); // Toggle the expanded state
  };

  // Fallback for missing data
  const imageUrl = show.image || 'default-image-url.jpg';
  const description = show.description || 'No description available';
  const genres = show.genres.length > 0 ? show.genres.join(', ') : 'Unknown';

  return (
    <CardContainer>
      <Image src={imageUrl} alt={`Image of ${show.title}`} />
      <Title>{show.title}</Title>
      <Genre>Genres: {genres}</Genre>
      <Description>
        {isExpanded ? description : `${description.substring(0, 100)}...`}
      </Description>
      <ActionButton onClick={toggleDescription}>
        {isExpanded ? 'See Less' : 'See More'} {/* Toggle button text */}
      </ActionButton>
      <Metadata>
        <MetadataItem>ID: {show.id}</MetadataItem>
        <MetadataItem>Updated: {new Date(show.updated).toLocaleDateString()}</MetadataItem>
      </Metadata>
      <Metadata>
        {show.language && <MetadataItem>Language: {show.language}</MetadataItem>}
      </Metadata>

      {/* Display seasons if available */}
      {show.seasons && (
        <SeasonList>
          {show.seasons.map((season) => (
            <SeasonItem key={season.season}>
              <strong>{season.title}</strong>
              <Image src={season.image} alt={`Image of ${season.title}`} />
              <Metadata>
                <MetadataItem>Season {season.season}</MetadataItem>
                <MetadataItem>Episodes: {season.episodes}</MetadataItem>
              </Metadata>
            </SeasonItem>
          ))}
        </SeasonList>
      )}
    </CardContainer>
  );
};

export default PreviewCard;
