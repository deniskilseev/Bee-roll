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
  const rating = 3.5; // Dummy rating value

  useEffect(() => {
    // Group streaming services by service name
    const newGroupedServices = {};
  
    streamingServices.forEach(service => {
      // Check if the service exists in newGroupedServices
      if (!newGroupedServices[service.service]) {
        // If not, initialize it with an object containing streaming types array and service link
        newGroupedServices[service.service] = {
          link: service.link,
          types: []
        };
      }
  
      // Check if the streaming type doesn't already exist in the array
      const existingService = newGroupedServices[service.service].types.find(
        item => item.type === service.streamingType
      );
  
      // If streaming type doesn't exist, add it to the types array
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
        const response = await axios.get(`http://localhost:3000/movies/getInfo/${movieId}`);
        console.log('Movie info:', response.data);
        setMovieInfo(response.data.movie_data);
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

  if (!movieInfo) {
    return <div className="container mt-5">Loading...</div>;
  }  

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
        </div>
        <div className="col-md-8">
          <h2>{movieInfo.title}</h2>
          <p><strong>Genres:</strong> {movieInfo.genres.join(', ')}</p>
          <p><strong>Rating:</strong> <Rating value={rating} /></p> {/* Display the rating */}
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
