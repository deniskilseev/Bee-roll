// Watchlist.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Watchlist = ({ watchlist }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title" onClick={toggleExpand}>
          {watchlist.data_by_id.watchListTitle}
        </h5>
        {isExpanded && (
          <div className="bg-light p-3 mt-2">
            <ul className="list-group">
              {watchlist.movies.map((movie) => (
                <li key={movie.id} className="list-group-item">
                  {movie.title}
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
