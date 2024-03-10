import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';

const AddMovieModal = ({ onClose }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearch = useCallback(
    _.debounce(async (input) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/movies/find/${input}`);
        console.log(await response.json());
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const data = await response.json();
        
        setSearchResults(data.results);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchInput.trim() !== '') {
      debouncedSearch(searchInput);
    }
  }, [searchInput, debouncedSearch]);

  return (
    <div className="popup">
      <div className="popup-inner p-3">
        <div className="input-group input-group-sm mb-3">
          <input
            type="text"
            className="form-control"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search..."
          />
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        <ul className="list-group mt-3">
          {searchResults.map((result) => (
            <li key={result.id} className="list-group-item">
              {result.title}
            </li>
          ))}
        </ul>

        <div className="mb-3">
          <button className="close-btn btn btn-secondary mr-2" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={() => console.log('added')}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMovieModal;
