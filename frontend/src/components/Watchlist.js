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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(watchlist.watchListTitle);
  const { user } = useUser();
  const token = user.token;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!showSearchBar) {
      setShowSearchBar(true);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleTitleChange = (event) => {
    // implement logic to handle title change
    // setEditedTitle(event.target.value);
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
      console.log('Adding to watchlist:', watchlist.watchListId, movieId);
      const response = await axios.post('http://localhost:3000/watchlists/addMovie', {
        watchlistId: watchlist.watchListId,
        movieId: movieId
      }, { headers });

      const updatedWatchlistResponse = await axios.get(`http://localhost:3000/watchlists/getWatchlist/${watchlist.watchListId}`, {
        headers: {
          'Authorization': `Bee-roll ${token}`
        }
      });

      console.log('Updated watchlist:', updatedWatchlistResponse.data.watchlist_data.movieIds);
      console.log('movies info:', moviesInfo);
      if (updatedWatchlistResponse.data) {
        watchlist.movieIds = updatedWatchlistResponse.data.watchlist_data.movieIds;
      }
      console.log('Added to watchlist:', response.data);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const deleteFromWatchlist = async (movieId) => { 
    try {

      console.log('Deleting from watchlist:', watchlist.watchListId, movieId);

      const headers = {
        'Authorization': `Bee-roll ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(`http://localhost:3000/watchlists/removeMovie`, {
        watchlistId: watchlist.watchListId,
        movieId: movieId
      }, { headers });

      const updatedWatchlistResponse = await axios.get(`http://localhost:3000/watchlists/getWatchlist/${watchlist.watchListId}`, {
        headers: {
          'Authorization': `Bee-roll ${token}`
        }
      });

      if (updatedWatchlistResponse.data) {
        watchlist.movieIds = updatedWatchlistResponse.data.watchlist_data.movieIds;
        setMoviesInfo([]);
      }
      console.log('Deleted from watchlist:', response.data);
    } catch (error) {
      console.error('Error deleting from watchlist:', error);
    }
  };

  useEffect(() => {
    const fetchMovieInfo = async () => {
      if (isExpanded && watchlist.movieIds && watchlist.movieIds.length > 0) {
        setMoviesInfo([]);
        const promises = watchlist.movieIds.map(async (movieId) => {
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
        setMoviesInfo(prevMoviesInfo => [
          ...prevMoviesInfo,
          ...movieInfoArray.filter(info => info !== null)
        ]);
      }
    };
    
    fetchMovieInfo();
  }, [isExpanded, watchlist.movieIds]);
  

  console.log('Watchlist:', watchlist);

  return (
    <div className="card mt-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title" onClick={toggleExpand}>
            {isEditMode ? (
              <input
                type="text"
                className="form-control"
                value={editedTitle}
                onChange={handleTitleChange}
              />
            ) : (
              watchlist.watchListTitle
            )}
          </h5>
          <div>
            <button className="btn btn-sm btn-primary mx-2" onClick={toggleEditMode}>
              {isEditMode ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
        {isExpanded && (
          <div>
            <div className="bg-light p-3 mt-2">
              <ul className="list-group">
                {moviesInfo.map((movieInfo) => (
                  <li key={movieInfo.movie_data.movieId} className="list-group-item">
                    {movieInfo.movie_data.title}
                    {isEditMode && (
                      <button className="btn btn-sm btn-danger ms-2" onClick={() => deleteFromWatchlist(movieInfo.movie_data.movieId)}>
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <h6>Add Movie</h6>
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