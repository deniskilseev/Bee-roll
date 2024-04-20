import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useUser } from '../UserContext';
import config from '../config';

const OtherUserWatchlist = ({ watchlist }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [moviesInfo, setMoviesInfo] = useState([]);
  const { user } = useUser();
  const token = user.token;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFollow = async () => {
    try {
      const headers = {
        'Authorization': `Bee-roll ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${config.apiBaseUrl}/watchlists/followWatchlist`,
        {
          watchlistId: watchlist.watchListId
        },
        { headers }
      );
      
      if (response.status === 200) {
        console.log('Successfully followed the watchlist');
      } else {
        console.error('Failed to follow the watchlist');
      }
    } catch (error) {
      console.error('Error following the watchlist', error);
    }
  };

  useEffect(() => {
    const fetchMovieInfo = async () => {
      const promises = watchlist.movieIds.map(async (movieId) => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/movies/getInfo/${movieId}`);
          
          if (response.ok) {
            const movieInfo = await response.json();
            return movieInfo;
          } else {
            console.error(`Failed to fetch movie info for ID: ${movieId}`);
            return null;
          }
        } catch (error) {
          console.error(`Error fetching movie info for ID: ${movieId}`, error);
          return null;
        }
      });
  
      const movieInfoArray = await Promise.all(promises);
      setMoviesInfo(movieInfoArray.filter((info) => info !== null));
    };
  
    if (isExpanded && watchlist.movieIds && watchlist.movieIds.length > 0) {
      fetchMovieInfo();
    }
  }, [isExpanded, watchlist.movieIds]);

  return (
    <div className="card mt-3">
      <div className="card-body d-flex align-items-center justify-content-between">
        <h5 className="card-title"onClick={toggleExpand}>
          {watchlist.watchListTitle}
        </h5>
        <button className="btn btn-primary" onClick={handleFollow}>
          Follow
        </button>
      </div>
        {isExpanded && (
          <div>
            <div className="bg-light p-3 mt-2">
              <ul className="list-group">
                {moviesInfo.map((movieInfo) => (
                  <li key={movieInfo.movie_data.movieId} className="list-group-item">
                    {movieInfo.movie_data.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
  );
};

export default OtherUserWatchlist;