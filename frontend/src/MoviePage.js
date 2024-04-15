import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/js/all.js';
import './styles/moviePage.css'; // Import your CSS file for styling

const MoviePage = () => {
  const { movieId } = useParams();
  const [movieInfo, setMovieInfo] = useState(null);
  const [imdbInfo, setImdbInfo] = useState(null);
  const rating = 3.5; // Dummy rating value
  const imdbApiKey = 'fb8301f8b9mshae8b57c86209d3bp18bb22jsne37629bd8f94';


  useEffect(() => {
    const fetchMovieInfo = async () => {
      try {
        // Fetch movie details from your backend
        const response = await axios.get(`http://localhost:3000/movies/getInfo/${movieId}`);
        console.log('Movie info:', response.data);
        setMovieInfo(response.data.movie_data);

        console.log("testing before imdb saved");
        const imdbId = response.data.movie_data.imdbId;
        console.log("Movie imdbID: ", imdbId);

        console.log("testing before routing to imdb");
        // Fetch additional movie details from IMDb API
        const imdbResponse = await axios.get(`https://imdb-api.com/en/API/Title/${imdbApiKey}/${imdbId}`);
        console.log("testing after routing before retreiving info from imdb");
        console.log('IMDb info:', imdbResponse.data);
        setImdbInfo(imdbResponse.data);    
      } catch (error) {
        console.error('Error fetching movie info:', error);
      }
    };

    fetchMovieInfo();
  }, [movieId, imdbApiKey]);

  if (!movieInfo || !imdbInfo) {
    return <div className="container mt-5">Loading...</div>;
  }

  const Rating = ({ value }) => {
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 !== 0;
  
    const fullStarsArray = Array.from({ length: fullStars }, (_, index) => (
      <i key={index} className="fa fa-star checked" />
    ));
  
    const halfStar = hasHalfStar ? <i className="fa fa-star-half checked" /> : null;
  
    return (
      <span>
        {fullStarsArray}
        {halfStar}
      </span>
    );
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <img
            src="https://via.placeholder.com/200x300"
            alt="Movie Poster"
            className="img-fluid rounded"
            style={{ marginBottom: '10px' }} // Added inline style for reducing spacing
          />
          <p><strong>Cast:</strong> {imdbInfo.cast}</p>
          <p><strong>Synopsis:</strong> {imdbInfo.plot}</p>
        </div>
        <div className="col-md-8">
          <h2>{movieInfo.title}</h2>
          <p><strong>Genres:</strong> {movieInfo.genres.join(', ')}</p>
          <p><strong>Rating:</strong> <Rating value={rating} /></p> {/* Display the rating */}
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
