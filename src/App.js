import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import './App.css';
import SearchIcon from './search.svg';


const API_URL = `http://www.omdbapi.com?apikey=${process.env.REACT_APP_OMDB_API_KEY}`;

const getAISuggestion = async (occasion) => {
  try {
    console.log('Sending occasion to API:', occasion);
    
    const response = await fetch('http://localhost:3001/api/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ occasion }),
      });
    
    console.log('API response status:', response.status);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    
    if (!response.ok) {
      throw new Error(data.error || response.statusText);
    }
    
    if (!data.suggestions) {
      throw new Error('No suggestion received from API');
    }
    
    return data.suggestions;
  } catch (error) {
    console.error('AI suggestion error:', error);
    throw error;
  }
};

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const searchMovies = async (title) => {
    try {
      const response = await fetch(`${API_URL}&s=${title}`);
      const data = await response.json();
      setMovies(data?.Search || []);
      setApiError(null);
    } catch (error) {
      console.error('OMDb search error:', error);
      setMovies([]);
      setApiError('Failed to search movies. Please try again.');
    }
  };

  const handleAISuggestion = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsLoading(true);
    setAiSuggestions([]);
    
    try {
      const suggestion = await getAISuggestion(aiPrompt);
      
      // Parse the suggestion (now handles both string and array cases)
      const suggestionList = typeof suggestion === 'string'
        ? suggestion.split(/\d+\.\s*/)
            .filter(item => item.trim().length > 0)
            .map(item => item.trim())
        : suggestion; // If it's already an array
      
      setAiSuggestions(suggestionList);
    } catch (error) {
      setAiSuggestions([`Error: ${error.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchMovies(searchTerm);
    }
  };

  useEffect(() => {
    searchMovies('The Imitation Game');
  }, []);

  return (
    <div className="app">
      <h1>Movie World</h1>

      <div className="ai-section">
        <div className="ai-input-wrapper">
          <p className="ai-description">
            Let AI suggest the perfect movie for your occasion. Just describe the context and we'll find a match!
          </p>
          <div className="ai-input-group">
            <input
              type="text"
              placeholder="Describe your occasion..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="ai-prompt-input"
              onKeyPress={(e) => e.key === 'Enter' && handleAISuggestion()}
            />
            <button 
              onClick={handleAISuggestion} 
              className="ai-suggest-button"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Loading...' : 'Suggest Movies'}
            </button>
          </div>

          {/* AI Suggestions List - Now independent from search */}
          {aiSuggestions.length > 0 && (
            <div className="ai-suggestions-window">
                <h3>AI Movie Agent Suggestions:</h3>
                <div className="ai-response">
                {aiSuggestions}
                </div>
            </div>
        )}
          {apiError && <div className="error-message">{apiError}</div>}
        </div>

        <div className="ai-gif-wrapper">
          <img src="/Scrolling.gif" alt="AI bot scrolling" className="ai-gif" />
        </div>
      </div>

      <div className="search">
        <input
          placeholder="Search for movies by the title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <img 
          src={SearchIcon} 
          alt="search" 
          onClick={handleSearch}
          className="search-icon"
        />
      </div>

      {apiError && !movies.length && (
        <div className="empty">
          <h2>{apiError}</h2>
        </div>
      )}

      {movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        !apiError && (
          <div className="empty">
            <h2>No movies found</h2>
          </div>
        )
      )}
    </div>
  );
};

export default App;
