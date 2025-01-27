import React, { useState } from 'react';
import "./styles/CreatePost.css";
import { useUser } from './UserContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import config from './config';

const CreatePost = () => {
  const navigate = useNavigate();
  const { forumName, postId } = useParams()
  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [createReview, setCreateReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [forumSearchQuery, setForumSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [movieId, setMovieId] = useState(null);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [forumId, setForumId] = useState(forumName);
  const { user } = useUser();
  const [forumSearchResults, setForumSearchResults] = useState([]);
  const token = user.token;

  const handleCreatePost = async () => {
    try {
      console.log('repostId:', postId);
      const newPost = {
        forumId: forumId,
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

      const response = await axios.post(`${config.apiBaseUrl}/posts/createPost`, newPost, { headers });
      const newPostId = response.data.postId;

      if (createReview) {
        const review = {
          movie_id: movieId,
          post_id: newPostId,
          review: rating
        };

        try {
          const response = await axios.post(`${config.apiBaseUrl}/reviews/createReview`, review, { headers });
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

  const handleForumClick = (forumId, forumTitle) => {
    setForumSearchQuery(forumTitle);
    setForumSearchResults([]);
    setForumId(forumId);
  };

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    fetchSearchResults(query);
  };

  const fetchSearchResults = async (query) => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/movies/find/${query}`);
      console.log('Search results:', response.data);
      setSearchResults(response.data.foundMovies.slice(0, 5));
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSearchResultClick = async (movieId, title) => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/movies/getInfo/${movieId}`);
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

  const handleForumSearchChange = async (event) => {
    const query = event.target.value;
    setForumSearchQuery(query);
    fetchForumSearchResults(query);
  };

  const fetchForumSearchResults = async (query) => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/forums/`);
      console.log('Forum search results:', response.data);
      setForumSearchResults(response.data.publicForums);
    } catch (error) {
      console.error('Error fetching forum search results:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  console.log('Forum search results:', forumSearchResults);

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
        {postId && (
          <div className="mb-3">
            <label htmlFor="forumSearch" className="form-label">Search Forum:</label>
            <input type="text" className="form-control" id="forumSearch" value={forumSearchQuery} onChange={handleForumSearchChange} placeholder="Search for a forum..." />
            <ul className="list-group">
              {forumSearchResults.map((forum) => (
                <li key={forum.forumId} className="list-group-item" onClick={() => handleForumClick(forum.forumId, forum.forumTitle)}>
                  {forum.forumTitle}
                </li>
              ))}
            </ul>
          </div>
        )}
        {createReview && (
          <div>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search for a movie..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
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
