import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/js/all.js';
import './styles/moviePage.css';

const MoviePage = () => {
  const { movieId } = useParams();
  const [movieInfo, setMovieInfo] = useState(null);
  const [cast, setCast] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [streamingServices, setStreamingServices] = useState([]);
  const [groupedServices, setGroupedServices] = useState({});
  const [posterUrl, setPosterUrl] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [rating, setRating] = useState(null);

  useEffect(() => {
    const newGroupedServices = {};
  
    streamingServices.forEach(service => {
      if (!newGroupedServices[service.service]) {
        newGroupedServices[service.service] = {
          link: service.link,
          types: []
        };
      }
  
      const existingService = newGroupedServices[service.service].types.find(
        item => item.type === service.streamingType
      );

      if (!existingService) {
        newGroupedServices[service.service].types.push({
          type: service.streamingType
        });
      }
    });
  
    setGroupedServices(newGroupedServices);
    console.log('Grouped services:', newGroupedServices);
  }, [streamingServices]);

  const Rating = ({ value }) => {
    if (value === -1) {
      return <span>Not rated</span>;
    }
    
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

  useEffect(() => {
    const fetchMovieInfo = async () => {
      try {
        const [movieResponse, ratingResponse] = await Promise.all([
          axios.get(`http://localhost:3000/movies/getInfo/${movieId}`),
          axios.get(`http://localhost:3000/reviews/getAverage/${movieId}`)
        ]);
        console.log('Movie info:', movieResponse.data);
        setMovieInfo(movieResponse.data.movie_data);
        setRating(ratingResponse.data.average);
        console.log('Rating response:', ratingResponse.data.average);
      } catch (error) {
        console.error('Error fetching movie info:', error);
      }
    };

    fetchMovieInfo();
  }, [movieId]);

  useEffect(() => {
    const fetchStreamingServices = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://streaming-availability.p.rapidapi.com/get',
          params: {
            imdb_id: 'tt0' + movieInfo.imdbId,
            output_language: 'en'
          },
          headers: {
            'X-RapidAPI-Key': 'a80fc5163emshf810171630d8210p1836bfjsn4930c976856b',
            'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
          }
        };
  
        const response = await axios.request(options);
        console.log('Response:', response.data);
        setStreamingServices(response.data.result.streamingInfo.us);
        setCast(response.data.result.cast);
        setDirectors(response.data.result.directors);
      } catch (error) {
        console.error('Error fetching streaming services:', error);
      }
    };

    if (movieInfo && movieInfo.imdbId) {
      fetchStreamingServices();
    }
  }, [movieInfo]);

  useEffect(() => {
    const fetchPosterImage = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/find/tt0${movieInfo.imdbId}?api_key=343ba297dc6c3267eaeada790beadd96&external_source=imdb_id`);
        console.log('Poster image response:', response.data);
        if (response.data && response.data.movie_results && response.data.movie_results.length > 0) {
          const posterPath = response.data.movie_results[0].poster_path;
          const overview = response.data.movie_results[0].overview;
          if (posterPath) {
            setPosterUrl(`https://image.tmdb.org/t/p/original/${posterPath}`);
          }
          if (overview) {
            setSynopsis(overview);
          }
        }
      } catch (error) {
        console.error('Error fetching poster image:', error);
      }
    };

    if (movieInfo && movieInfo.imdbId) {
      fetchPosterImage();
    }
  }, [movieInfo]);

  if (!movieInfo) {
    return <div className="container mt-5">Loading...</div>;
  }  

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <img
            src={posterUrl || "https://via.placeholder.com/200x300"}
            alt="Movie Poster"
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-8">
          <h2>{movieInfo.title}</h2>
          <p><strong>Synopsis:</strong> {synopsis} </p>
          <p><strong>Genres:</strong> {movieInfo.genres.join(', ')}</p>
          <p><strong>Rating:</strong> <Rating value={rating} /></p>
          <div>
            <strong>Cast:</strong>
            <ul>
              {cast.map((actor, index) => (
                <li key={index}>{actor}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Directors:</strong>
            <ul>
              {directors.map((director, index) => (
                <li key={index}>{director}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Streaming Services:</strong>
            <ul>
              {Object.entries(groupedServices).map(([serviceName, serviceInfo]) => (
                <li key={serviceName}>
                  <a href={serviceInfo.link} target="_blank" rel="noopener noreferrer">
                    {serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}
                  </a>
                  <ul>
                    {serviceInfo.types.map((typeObj, index) => (
                      <li key={index}>{typeObj.type}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
