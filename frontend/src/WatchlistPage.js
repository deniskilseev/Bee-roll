// WatchlistsPage.js
import React from 'react';
import Watchlist from './components/Watchlist';
import watchlists from './dummyWatchlistData';
import 'bootstrap/dist/css/bootstrap.min.css';

const WatchlistsPage = () => {
  return (
    <div className="container mt-5">
      <h1 className="mb-4">My Watchlists</h1>
      {watchlists.map((watchlist) => (
        <Watchlist key={watchlist.id} watchlist={watchlist} />
      ))}
    </div>
  );
};

export default WatchlistsPage;
