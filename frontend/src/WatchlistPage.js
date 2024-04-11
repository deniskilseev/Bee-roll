// WatchlistsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import Watchlist from './components/Watchlist';
import { useUser } from './UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const WatchlistsPage = () => {
  const [watchlists, setWatchlists] = useState([]);
  const { updateWatchlists } = useUser();
  const { user } = useUser();
  const token = user.token;

  const createWatchlist = async () => {
    //TODO: Fix create watchlist
    try {
      const response = await fetch('http://localhost:3000/watchlists/createWatchlist', {
        method: 'POST',
        headers: {
          'Authorization': `Bee-roll ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.userData.data_by_username.login,
          is_public: false,
          watchlist_title: 'New Watchlist 3',
        }),
      });

      if (response.ok) {
        const watchlistData = await response.json();
        
        const createdWatchlist = await fetchWatchlist(watchlistData.newId);
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
      if (watchlists.some((watchlist) => watchlist.data_by_id.watchListId === watchListId)) {
        return;
      }

      const response = await fetch(`http://localhost:3000/watchlists/getWatchlist/${watchListId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bee-roll ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const watchlistData = await response.json();
        setWatchlists((prevWatchlists) => {
          if (!prevWatchlists.some((watchlist) => watchlist.data_by_id.watchListId === watchListId)) {
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
          <Watchlist key={watchlist.data_by_id.watchListId} watchlist={watchlist} />
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
