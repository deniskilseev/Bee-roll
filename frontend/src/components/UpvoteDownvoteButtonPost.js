import React, { useEffect, useState } from 'react';
import '../styles/UpvoteDownvoteButton.css'; // Import CSS file for styling
import { useUser } from '../UserContext';
import axios from 'axios';
import config from '../config';

const UpvoteDownvoteButton = (props) => {
  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState(null); // 'up' for upvoted, 'down' for downvoted, null for not voted
  
  const { user } = useUser();
  const token = user.token;
  const postId = props.postId;

  const user_data = user.userData.data_by_username;

  const headers = {
    'Authorization': `Bee-roll ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/posts/getPost/${postId}`, [], {headers});
        const fetchedPost = response.data.post_info;
        setVotes(fetchedPost.rating);
        if (user_data.downvotedPosts?.includes(postId)) {
          setVoted('down');
        }
        else if (user_data.upvotedPosts?.includes(postId)) {
          setVoted('up');
        }
        else {
          setVoted(null);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPostData();
  }, [postId, user_data]);

  // Function to handle upvote
  const handleUpvote = async () => {
    try {
      if (voted === 'up') {
        await axios.put(`${config.apiBaseUrl}/posts/revoke/${postId}`,[] ,{headers});
        setVotes(votes - 1);
        setVoted(null);
      }
      else if (voted === 'down') {
        await axios.put(`${config.apiBaseUrl}/posts/upvote/${postId}`,[] ,{headers});
        setVotes(votes + 2);
        setVoted('up');
      }
      else if (voted === null) {
        await axios.put(`${config.apiBaseUrl}/posts/upvote/${postId}`,[] ,{headers});
        setVotes(votes + 1);
        setVoted('up');
      }
    } catch (error) {
      console.log("Error in upvoting", error);
    }
  };

  // Function to handle downvote
  const handleDownvote = async () => {
    try {
      if (voted === 'down') {
        await axios.put(`${config.apiBaseUrl}/posts/revoke/${postId}`,[] , {headers});
        setVotes(votes + 1);
        setVoted(null);
      }
      if (voted === 'up') {
        await axios.put(`${config.apiBaseUrl}/posts/downvote/${postId}`,[] , {headers});
        setVotes(votes - 2);
        setVoted('down');
      }
      if (voted === null) {
        await axios.put(`${config.apiBaseUrl}/posts/downvote/${postId}`,[] , {headers});
        setVotes(votes - 1);
        setVoted('down');
      }
    } catch (error) {
      console.log("Error in downvoting", error);
    }
  };

  return (
    <div>
      <button className={voted === 'up' ? 'upvoted' : ''} onClick={handleUpvote}>
        <i className="fa fa-arrow-up"></i>
      </button>
      <span>{votes}</span>
      <button className={voted === 'down' ? 'downvoted' : ''} onClick={handleDownvote}>
        <i className="fa fa-arrow-down"></i>
      </button>
    </div>
  );
};

export default UpvoteDownvoteButton;
