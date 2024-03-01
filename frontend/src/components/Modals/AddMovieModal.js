import React, { useState, useEffect, useCallback } from 'react';


const AddMovieModal = ({ onClose }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = useCallback(async () => {
    // Implement your logic for searching movies based on searchInput
    // Update the searchResults state accordingly
    console.log('Searching for:', searchInput);
  }, [searchInput]);

  useEffect(() => {
    handleSearch();
  }, [searchInput, handleSearch]);

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
