import React from 'react';

const Movie = ({ title }) => {
  return (
    <div className="card">
      <div className="card-header" id={`movieHeading${title}`}>
        <h2 className="mb-0">
          <button
            className="btn btn-link"
            type="button"
            data-toggle="collapse"
            data-target={`#movieCollapse${title}`}
            aria-expanded="true"
            aria-controls={`movieCollapse${title}`}
          >
            {title}
          </button>
        </h2>
      </div>

      <div
        id={`movieCollapse${title}`}
        className="collapse"
        aria-labelledby={`movieHeading${title}`}
        data-parent="#movieAccordion"
      >
        <div className="card-body">
          {/* You can add more details about the movie here */}
          {/* For example: Release date, genre, etc. */}
          {/* Example: <p>Release Date: January 1, 2022</p> */}
        </div>
      </div>
    </div>
  );
};

export default Movie;