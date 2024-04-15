import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/js/all.js';
import './styles/moviePage.css'; // Import your CSS file for styling

// Import statements remain the same...

const MoviePage = () => {
  const { movieId } = useParams();
  const [movieInfo, setMovieInfo] = useState(null);
  const [imdbInfo, setImdbInfo] = useState(null);
  const rating = 3.5; // Dummy rating value
  const imdbApiKey = '72732e435fmsh651c885f454e098p17f65ajsn8f074f33cca3';
  
  useEffect(() => {
    const fetchMovieInfo = async () => {
      try {
        // Fetch movie details from your backend
        const response = await axios.get(`http://localhost:3000/movies/getInfo/${movieId}`);
        console.log('Movie info:', response.data);
        setMovieInfo(response.data.movie_data);

        console.log("testing before imdb saved");
        const imdbId = response.data.movie_data.title;
        console.log("Movie imdbID: ", imdbId);

        console.log("testing before routing to imdb");
        // Fetch additional movie details from IMDb API
        const options = {
          method: 'GET',
          url: 'https://imdb8.p.rapidapi.com/auto-complete',
          params: {
            q: imdbId
          },
          headers: {
            'X-RapidAPI-Key': '72732e435fmsh651c885f454e098p17f65ajsn8f074f33cca3',
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
          }
        };
        
        const imdbResponse = await axios.request(options);
        console.log("testing after routing before retreiving info from imdb");
        console.log('IMDb info:', imdbResponse.data);
        // Extract information from the first item in the response
        const firstItem = imdbResponse.data.d[0];
        setImdbInfo(firstItem);    
      } catch (error) {
        console.error('Error fetching movie info:', error);
      }
    };

    fetchMovieInfo();
  }, [movieId, imdbApiKey]);

  if (!movieInfo || !imdbInfo) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          {/* Display IMDb image for the movie in the thumbnail space */}
          <img
            src={imdbInfo.i.imageUrl}
            alt={imdbInfo.l}
            className="img-fluid rounded"
            style={{ marginBottom: '10px' }} 
          />
          <p><strong>Cast:</strong> {imdbInfo.s}</p> {/* Display the movie's cast below the thumbnail */}
          <p><strong>Synopsis:</strong> {imdbInfo.l}</p> {/* Assuming 'l' contains the movie's title */}
        </div>
        <div className="col-md-8">
          <h2>{movieInfo.title}</h2>
          <p><strong>Genres:</strong> {movieInfo.genres.join(', ')}</p>
          <p><strong>Rating:</strong> <rating value={rating} /></p>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
