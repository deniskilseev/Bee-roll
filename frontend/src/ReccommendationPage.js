import React, { useState, useEffect } from 'react';
import { Card, Loader, Message } from 'semantic-ui-react';
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';
import config from './config';

const RecommendationPage = () => {
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
          'Content-Type': 'application/json'
        };
        const response = await fetch(`${config.apiBaseUrl}/predict/predictUser`, { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        const movieIds = data.movie_ids;

        const moviesInfoPromises = movieIds.map(async (movieId) => {
          try {
            const movieResponse = await fetch(`${config.apiBaseUrl}/movies/getInfo/${movieId}`, { headers });
            if (!movieResponse.ok) {
              throw new Error(`Failed to fetch movie info for movie ID ${movieId}`);
            }
            const movieData = await movieResponse.json();
            return movieData.movie_data;
          } catch (error) {
            console.error(error.message);
            return null;
          }
        });

        const moviesInfo = await Promise.all(moviesInfoPromises);
        
        const validMoviesInfo = moviesInfo.filter(movie => movie !== null);

        setMovies(validMoviesInfo);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [token]);

  return (
    <div className="movie-page">
      <h1>Personalized Movie Recommendations</h1>
      {loading && <Loader active>Loading...</Loader>}
      {error && <Message negative>{error}</Message>}
      <ul>
        {movies.map((movie) => (
          <li key={movie.movieId}>
            <Link to={`/movies/${movie.movieId}`}>{movie.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationPage;
