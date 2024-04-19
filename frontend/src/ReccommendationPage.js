import React, { useState, useEffect } from 'react';
import { Card, Loader, Message } from 'semantic-ui-react';
import MoviePage from './MoviePage'; // Import MoviePage component
import { useUser } from './UserContext';
import MovieCard from './MovieCard';
import { Link, useNavigate } from 'react-router-dom';


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
        const response = await fetch('http://localhost:3000/predict/predictUser', { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data.movie_ids);
        console.log("testing data: ", data);
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
      <h1>Movie Page</h1>
      {loading && <Loader active>Loading...</Loader>}
      {error && <Message negative>{error}</Message>}
      <ul>
        {movies.map(movieId => (
          <li key={movieId}>
            <Link to={`/movies/${movieId}`}>Movie ID: {movieId}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReccommendationPage;
