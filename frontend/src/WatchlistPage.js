// WatchlistsPage.js
import React, { useState, useEffect } from 'react';
import Watchlist from './components/Watchlist';
// import watchlists from './dummyWatchlistData';
import 'bootstrap/dist/css/bootstrap.min.css';

const WatchlistsPage = ({ user }) => {
  const [watchlists, setWatchlists] = useState([]);

  const createWatchlist = async () => {
    try {
      const response = await fetch('http://localhost:3000/watchlists/createWatchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          is_public: false,
          watchlist_title: 'nonde',
        }),
      });

      if (response.ok) {
        console.log('Watchlist created successfully!');
      } else {
        console.error('Failed to create watchlist.');
      }
    } catch (error) {
      console.error('Error creating watchlist:', error);
    }
  };

  
  const fetchWatchlist = async (watchListId) => {
    try {
      const response = await fetch(`http://localhost:3000/watchlists/getWatchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          watchlist_id: watchListId,
        }),
      });

      if (response.ok) {
        const watchlistData = await response.json();
        setWatchlists((prevWatchlists) => [...prevWatchlists, watchlistData]);
      } else {
        console.error(`Failed to fetch watchlist: ${watchListId}`);
      }
    } catch (error) {
      console.error(`Error fetching watchlist: ${watchListId}`, error);
    }
  };

  useEffect(() => {
    // Fetch individual watchlists when the component mounts
    user.watchlists.forEach((watchListId) => {
      fetchWatchlist(watchListId);
    });
  }, [user.watchlists]);

  return (
    <div className="container mt-5">
      {watchlists.length > 0 ? (
        watchlists.map((watchlist) => (
          <Watchlist key={watchlist.data_by_id._id} watchlist={watchlist} />
        ))
      ) : (
        <button className="btn btn-primary mt-3" onClick={createWatchlist}>
          Create Watchlist
        </button>
      )}
    </div>
  );
};

export default WatchlistsPage;
