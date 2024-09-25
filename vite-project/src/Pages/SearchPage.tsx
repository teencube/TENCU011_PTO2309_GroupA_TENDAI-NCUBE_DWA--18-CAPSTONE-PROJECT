import { useState, useEffect } from 'react';
import PreviewCard from '../Components/PreviewCard';
import styled from 'styled-components';


interface Show {
  id: string;
  image: string;
  title: string;
  description: string;
  updated: string;
  genres: string[]; 
}


const genreMapping: { [key: string]: string } = {
  '1': 'Personal Growth',
  '2': 'True Crime and Investigative Journalism',
  '3': 'History',
  '4': 'Comedy',
  '5': 'Entertainment',
  '6': 'Business',
  '7': 'Fiction',
  '8': 'News',
  '9': 'Kids and Family',
};

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  min-height: 100vh;
  box-sizing: border-box;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  max-width: 600px;
`;

const AlphabetFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const AlphabetButton = styled.button<{ $active: boolean }>`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: ${({ $active }) => ($active ? '#4e54c8' : '#555')};
  color: ${({ $active }) => ($active ? '#fff' : '#ddd')};
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: ${({ $active }) => ($active ? '0 0 10px #4e54c8, 0 0 20px #4e54c8' : 'none')};

  &:hover {
    background-color: #4e54c8;
    box-shadow: 0 0 10px #4e54c8, 0 0 20px #4e54c8;
  }
`;

const GenreFilter = styled.select`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;
  margin-bottom: 20px;
`;

const ShowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: #333;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: red;
`;

const SearchPage = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://podcast-api.netlify.app/shows');
        if (!response.ok) {
          throw new Error('Failed to fetch shows');
        }
        const data = await response.json();
        setShows(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  // Filter logic
  const filteredShows = shows.filter(show => {
    const matchesTitle = show.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter = selectedLetter === '' || show.title.startsWith(selectedLetter);
    const matchesGenre = selectedGenre === '' || show.genres.includes(selectedGenre);
    return matchesTitle && matchesLetter && matchesGenre;
  });

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleShare = (show: Show) => {
    alert(`Sharing show: ${show.title}`);
  };

  return (
    <Container>
      <Title>Search Shows</Title>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      <AlphabetFilter>
        {alphabet.map(letter => (
          <AlphabetButton
            key={letter}
            $active={selectedLetter === letter}
            onClick={() => setSelectedLetter(letter)}
            aria-label={`Filter by letter ${letter}`}
          >
            {letter}
          </AlphabetButton>
        ))}
        <AlphabetButton $active={selectedLetter === ''} onClick={() => setSelectedLetter('')} aria-label="Reset filter">
          Reset
        </AlphabetButton>
      </AlphabetFilter>

      <GenreFilter 
        value={selectedGenre}
        onChange={e => setSelectedGenre(e.target.value)} 
        aria-label="Filter by genre"
      >
        <option value="">All Genres</option>
        {Object.entries(genreMapping).map(([id, title]) => (
          <option key={id} value={id}>{title}</option>
        ))}
      </GenreFilter>

      <ShowGrid>
        {loading && <LoadingMessage>Loading shows...</LoadingMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {filteredShows.length > 0 && !loading ? (
          filteredShows.map(show => (
            <PreviewCard
              key={show.id}
              show={show}
              onShare={handleShare}
              onDelete={undefined}
            />
          ))
        ) : (
          !loading && <p>No shows found.</p>
        )}
      </ShowGrid>
    </Container>
  );
};

export default SearchPage;
