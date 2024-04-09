import React, { useState, useEffect } from 'react';
import AddMovieModal from './Modals/AddMovieModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useUser } from '../UserContext';

const Watchlist = ({ watchlist }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [moviesInfo, setMoviesInfo] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useUser();
  const token = user.userData.token;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!showSearchBar) {
      setShowSearchBar(true);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    fetchSearchResults(query);
  };

  const fetchSearchResults = async (query) => {
    try {
      const response = await axios.get(`http://localhost:3000/movies/find/${query}`);
      setSearchResults(response.data.foundMovies.slice(0, 5)); // Limit results to 5
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const addToWatchlist = async (movieId) => {
    try {
      const headers = {
        'Authorization': `Bee-roll ${token}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.post('http://localhost:3000/watchlists/addMovie', {
        watchlist_id: watchlist.data_by_id.watchListId,
        movie_id: movieId,
        //TODO: Fix Rating is not defined error
      }, { headers });
      console.log('Added to watchlist:', response.data);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
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

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title" onClick={toggleExpand}>
          {watchlist.data_by_id.watchListTitle}
        </h5>
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
            <h7>Add Movie</h7>
            {showSearchBar && (
              <div className="input-group mt-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            )}
            {showSearchBar && searchResults.length > 0 && (
              <ul className="list-group mt-2">
                {searchResults.map((result, index) => (
                  <li key={index} className="list-group-item" onClick={() => addToWatchlist(result.movieId)}>
                    {result.title}
                  </li>
                ))}
              </ul>
            )}
            {isPopupOpen && <AddMovieModal onClose={closePopup} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;