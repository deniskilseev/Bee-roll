// WatchlistsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import Watchlist from './components/Watchlist';
import { useUser } from './UserContext';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const WatchlistsPage = () => {
  const [watchlists, setWatchlists] = useState([]);
  const { updateWatchlists, updateUser } = useUser();
  const { user } = useUser();
  const token = user.token;

  const createWatchlist = async () => {
    try {
      const headers = {
        'Authorization': `Bee-roll ${token}`,
        'Content-Type': 'application/json',
      };
  
      const response = await axios.post('http://localhost:3000/watchlists/createWatchlist', {
        isPublic: false,
        watchlistTitle: 'New Watchlist 8',
      }, { headers });

      if (response.status === 201) {
        const userResponse = await axios.get('http://localhost:3000/users/getSelf', {
          headers: {
            'Authorization': `Bee-roll ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (userResponse.status === 200) {
          updateUser(userResponse.data, userResponse.data.token);
        }
        const createdWatchlist = await fetchWatchlist(user.userData.data_by_username.watchListsIds[user.userData.data_by_username.watchListsIds.length - 1]);
        
        updateWatchlists(createdWatchlist);
      } else {
        console.error('Failed to create watchlist.');
      }
    } catch (error) {
      console.error('Error creating watchlist:', error);
    }
  };

  const fetchWatchlist = useCallback(async (watchListId) => {
    try {
      if (watchlists.some((watchlist) => watchlist.watchListId === watchListId)) {
        return;
      }

      const response = await axios.get(`http://localhost:3000/watchlists/getWatchlist/${watchListId}`, {
        headers: {
          'Authorization': `Bee-roll ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        const watchlistData = await response.data.watchlist_data;
        setWatchlists((prevWatchlists) => {
          if (!prevWatchlists.some((watchlist) => watchlist.watchListId === watchListId)) {
            return [...prevWatchlists, watchlistData];
          } else {
            return prevWatchlists;
          }
        });
        return watchlistData;
      } else {
        console.error(`Failed to fetch watchlist: ${watchListId}`);
      }
    } catch (error) {
      console.error(`Error fetching watchlist: ${watchListId}`, error);
    }
  }, [watchlists, token]);

  useEffect(() => {
    const fetchInitialWatchlists = async () => {
      for (const watchListId of user.userData.data_by_username.watchListsIds) {
        await fetchWatchlist(watchListId);
      }
    };

    fetchInitialWatchlists();
  }, [user.watchlists, fetchWatchlist, user.userData.data_by_username.watchListsIds]);

  return (
    <div className="container mt-5">
      {watchlists.length > 0 ? (
        watchlists.map((watchlist) => (
          <Watchlist key={watchlist.watchListId} watchlist={watchlist} />
        ))
      ) : (
        <p>No watchlists found.</p>
      )}
      <button className="btn btn-primary mt-3" onClick={createWatchlist}>
          Create Watchlist
        </button>
    </div>
  );
};

export default WatchlistsPage;
