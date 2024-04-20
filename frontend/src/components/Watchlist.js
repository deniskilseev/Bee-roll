import React, { useState, useEffect } from 'react';
import AddMovieModal from './Modals/AddMovieModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useUser } from '../UserContext';
import '../styles/watchlistCard.css';
import config from '../config';

const Watchlist = ({ watchlist }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [moviesInfo, setMoviesInfo] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPublic, setIsPublic] = useState(watchlist.isPublic);
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

  const toggleVisibility = async () => {
    try {
      const headers = {
        'Authorization': `Bee-roll ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(`${config.apiBaseUrl}/watchlists/togglePublic`, {
        watchlistId: watchlist.watchListId
      }, {
        headers
      });

      if (response.status === 200) {
        setIsPublic(!isPublic);
      }
    } catch (error) {
      console.error('Error toggling watchlist visibility:', error);
    }
  };

  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleSaveTitle = async () => {
    try {
      const headers = {
        'Authorization': `Bee-roll ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.put(`${config.apiBaseUrl}/watchlists/changeTitle`, {
        watchlistId: watchlist.watchListId,
        newTitle: editedTitle
      }, { headers });

      if (response.status === 200) {
        console.log('Watchlist title changed successfully');
      } else {
        console.error('Failed to change watchlist title');
      }
    } catch (error) {
      console.error('Error changing watchlist title:', error);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    fetchSearchResults(query);
  };

  const fetchSearchResults = async (query) => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/movies/find/${query}`);
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
      const response = await axios.post(`${config.apiBaseUrl}/watchlists/addMovie`, {
        watchlistId: watchlist.watchListId,
        movieId: movieId
      }, { headers });

      if (response.status === 200) {
        console.log('Successfully added to watchlist');
      } else {
        console.error(`Failed to add to watchlist`);
      }

      const updatedWatchlistResponse = await axios.get(`${config.apiBaseUrl}/watchlists/getWatchlist/${watchlist.watchListId}`, {
        headers: {
          'Authorization': `Bee-roll ${token}`
        }
      });

      if (updatedWatchlistResponse.data) {
        watchlist.movieIds = updatedWatchlistResponse.data.watchlist_data.movieIds;
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const deleteFromWatchlist = async (movieId) => {
    try {
      const headers = {
        'Authorization': `Bee-roll ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(`${config.apiBaseUrl}/watchlists/removeMovie`, {
        watchlistId: watchlist.watchListId,
        movieId: movieId
      }, { headers });

      if (response.status === 200) {
        console.log('Successfully removed from watchlist');
      } else {
        console.error(`Failed to remove from watchlist`);
      }

      const updatedWatchlistResponse = await axios.get(`${config.apiBaseUrl}/watchlists/getWatchlist/${watchlist.watchListId}`, {
        headers: {
          'Authorization': `Bee-roll ${token}`
        }
      });

      if (updatedWatchlistResponse.data) {
        watchlist.movieIds = updatedWatchlistResponse.data.watchlist_data.movieIds;
        setMoviesInfo([]);
      }
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
        setMoviesInfo(prevMoviesInfo => [
          ...prevMoviesInfo,
          ...movieInfoArray.filter(info => info !== null)
        ]);
      }
    };

    fetchMovieInfo();
  }, [isExpanded, watchlist.movieIds]);

  return (
    <div className="card mt-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
            {isEditMode ? (
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  value={editedTitle}
                  onChange={handleTitleChange}
                />
                <button className="btn btn-sm btn-primary" onClick={handleSaveTitle}>
                  Save
                </button>
              </div>
            ) : (
              <h5 className="card-title" onClick={toggleExpand}>
                {watchlist.watchListTitle}
              </h5>
            )}
          <div className="d-flex align-items-center">
            <div className="privacy-section me-3">
              <label className="privacy-label">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={toggleVisibility}
                />
                <span className="privacy-slider"></span>
              </label>
              <span className="privacy-text">{isPublic ? 'Public' : 'Private'}</span>
            </div>
            <button className="btn btn-sm btn-primary" onClick={toggleEditMode}>
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