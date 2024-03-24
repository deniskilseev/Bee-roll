// MoviePage.js
import React from 'react';
import { Card } from 'semantic-ui-react';
import MovieCard from './MovieCard';

const MoviePage = () => {
  // Dummy movie data
  const movies = [
    { id: 1, title: 'Movie 1', thumbnailUrl: 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg' },
    { id: 2, title: 'Movie 2', thumbnailUrl: 'https://example.com/movie2.jpg' },
    // Add more dummy movie data as needed
  ];

  return (
    <div className="movie-page">
      <h1>Movie Page</h1>
      <Card.Group>
        {movies.map(movie => (
          <MovieCard key={movie.id} title={movie.title} thumbnailUrl={movie.thumbnailUrl} />
        ))}
      </Card.Group>
    </div>
  );
};

export default MoviePage;
