// Watchlist.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Watchlist = ({ watchlist }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [moviesInfo, setMoviesInfo] = useState([]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchMovieInfo = async () => {
      const promises = watchlist.data_by_id.movieIds.map(async (movieId) => {
        try {
          const response = await fetch(`http://localhost:3000/movies/getInfo/${movieId}`);
          console.log('Response for movieId', movieId, response);
  
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
  
    if (isExpanded && watchlist.data_by_id.movieIds && watchlist.data_by_id.movieIds.length > 0) {
      fetchMovieInfo();
    }
  }, [isExpanded, watchlist.data_by_id.movieIds]);

  console.log(watchlist.data_by_id.movieIds);
  console.log(moviesInfo);

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title" onClick={toggleExpand}>
          {watchlist.data_by_id.watchListTitle}
        </h5>
        {isExpanded && (
          <div className="bg-light p-3 mt-2">
            <ul className="list-group">
              {moviesInfo.map((movieInfo) => (
                <li key={movieInfo.movie_data.movieId} className="list-group-item">
                  {movieInfo.movie_data.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
