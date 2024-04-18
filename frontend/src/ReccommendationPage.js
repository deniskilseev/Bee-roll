import React, { useState, useEffect } from 'react';
import { Card, Loader, Message } from 'semantic-ui-react';
import MovieCard from './MovieCard';
import { useUser } from './UserContext';

const ReccommendationPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const token = user.token;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const headers = {
          'Authorization': `Bee-roll ${token}`,
          'Content-Type': `application/json`
        };
        const response = await fetch('http://localhost:3000/predict/predictUser', { headers }); // Assuming '/api/movies' is the endpoint to fetch all movies
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data.movies);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="movie-page">
      <h1>Movie Page</h1>
      {loading && <Loader active>Loading...</Loader>}
      {error && <Message negative>{error}</Message>}
      <Card.Group>
        {movies.map(movie => (
          <MovieCard key={movie._id} title={movie.title} thumbnailUrl={movie.thumbnailUrl} />
        ))}
      </Card.Group>
    </div>
  );
};

export default ReccommendationPage;