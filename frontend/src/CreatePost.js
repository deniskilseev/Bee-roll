import React, { useState } from 'react';
import "./styles/CreatePost.css";
import { useUser } from './UserContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const { forumName, postId } = useParams()
  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [createReview, setCreateReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [movieId, setMovieId] = useState(null);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const { user } = useUser();
  const token = user.token;

  const handleCreatePost = async () => {
    try {
      console.log('repostId:', postId); // Check the value of repostId
      const newPost = {
        forumId: forumName,
        postTitle: postTitle,
        postText: postText,
        containsSpoilers: containsSpoilers,
      };

      if (postId) {
        newPost.repostId = postId;
      }

      console.log('New post:', newPost);

      const headers = {
        'Authorization': `Bee-roll ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post('http://localhost:3000/posts/createPost', newPost, { headers });
      const newPostId = response.data.postId;

      if (createReview) {
        const review = {
          movie_id: movieId,
          post_id: newPostId,
          review: rating
        };

        try {
          const response = await axios.post('http://localhost:3000/reviews/createReview', review, { headers });
          console.log('Review created:', response.data);
        } catch (error) {
          console.error('Error creating review:', error);
        }
      }
      

      setPostTitle('');
      setPostText('');
      setContainsSpoilers(false);
      setCreateReview(false);
      setSearchQuery('');
      setRating(null);
      navigate(-1);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    fetchSearchResults(query);
  };

  const fetchSearchResults = async (query) => {
    try {
      const response = await axios.get(`http://localhost:3000/movies/find/${query}`);
      console.log('Search results:', response.data);
      setSearchResults(response.data.foundMovies.slice(0, 5));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSearchResultClick = async (movieId, title) => {
    try {
      const response = await axios.get(`http://localhost:3000/movies/getInfo/${movieId}`);
      console.log('Movie info:', response.data);
      setSearchQuery(title);
      setMovieId(movieId);
      setSearchResults([]);
    } catch (error) {
      console.error('Error fetching movie info:', error);
    }
  };

  const handleRatingChange = (selectedRating) => {
    console.log('Selected rating:', selectedRating);
    setRating(selectedRating);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-5">
      <h1>Create Post</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="postTitle" className="form-label">Post Title:</label>
          <input type="text" className="form-control" id="postTitle" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="postText" className="form-label">Post Text:</label>
          <textarea className="form-control" id="postText" value={postText} onChange={(e) => setPostText(e.target.value)} />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="containsSpoilers" checked={containsSpoilers} onChange={(e) => setContainsSpoilers(e.target.checked)} />
          <label className="form-check-label" htmlFor="containsSpoilers">Contains Spoilers</label>
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="createReview" checked={createReview} onChange={(e) => setCreateReview(e.target.checked)} />
          <label className="form-check-label" htmlFor="createReview">Create Review</label>
        </div>
        {createReview && (
          <div>
            {/* Search bar with suggestions */}
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search for a movie..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            {/* Display search results */}
            <ul className="list-group">
              {searchResults.map((result, index) => (
                <li key={index} className="list-group-item" onClick={() => handleSearchResultClick(result.movieId, result.title)}>
                  {result.title}
                </li>
              ))}
            </ul>
            <div className="mb-3">
              <label className="form-label">Rate the movie:</label>
              {[...Array(5)].map((star, index) => {
                const currentRating = index + 1;

                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      value={currentRating}
                      onChange={() => handleRatingChange(currentRating)}
                    />
                    <span
                      className="star"
                      style={{
                        color:
                          currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                      }}
                      onMouseEnter={() => setHover(currentRating)}
                      onMouseLeave={() => setHover(null)}
                    >
                      &#9733;
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
        <div className="mb-3">
          <button type="button" className="btn btn-primary mr-2" onClick={handleCreatePost}>Create Post</button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
