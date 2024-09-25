import React, { useState } from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.02);
  }
`;

const Image = styled.img`
  width: 60%;
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
  
  &:hover {
    background-color: #444;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(0, 0, 0, 0.7);
  }
`;

interface Show {
  id: string;
  image: string;
  title: string;
  description: string;
  updated: string;
  genres: string[]; 
  seasons?: number;
  episodes?: number;
  language?: string;
}

interface PreviewCardProps {
  show: Show;
  onDelete?: (id: string) => void;
  onShare?: (show: Show) => void;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ show, onDelete, onShare }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <CardContainer>
      <Image src={show.image} alt={`Image of ${show.title}`} />
      <Title>{show.title}</Title>
      <Genre>Genres: {show.genres.join(', ')}</Genre> {/* Added Genres */}
      <Description>
        {isExpanded ? show.description : `${show.description.substring(0, 100)}...`}
      </Description>
      <ActionButton onClick={toggleDescription}>
        {isExpanded ? 'See Less' : 'See More'}
      </ActionButton>
      <Metadata>
        <MetadataItem>Updated: {new Date(show.updated).toLocaleDateString()}</MetadataItem>
        {show.language && <MetadataItem>Language: {show.language}</MetadataItem>}
        {show.seasons && <MetadataItem>Seasons: {show.seasons}</MetadataItem>}
        {show.episodes && <MetadataItem>Episodes: {show.episodes}</MetadataItem>}
      </Metadata>
      <Metadata>
        {onShare && <ActionButton onClick={() => onShare(show)}>Share</ActionButton>}
        {onDelete && <ActionButton onClick={() => onDelete(show.id)}>Delete</ActionButton>}
      </Metadata>
    </CardContainer>
  );
};

export default PreviewCard;
