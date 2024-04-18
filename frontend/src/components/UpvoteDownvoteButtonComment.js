import React, { useEffect, useState } from 'react';
import '../styles/UpvoteDownvoteButton.css'; // Import CSS file for styling
import { useUser } from '../UserContext';
import axios from 'axios';

const UpvoteDownvoteButtonComment = (props) => {
  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState(null); // 'up' for upvoted, 'down' for downvoted, null for not voted
  
  const { user } = useUser();
  const token = user.token;
  const commentId = props.commentId;

  const user_data = user.userData.data_by_username;

  const headers = {
    'Authorization': `Bee-roll ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    const fetchCommentData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/comments/${commentId}`, [], {headers});
        const fetchedComment = response.data.comment;
        setVotes(fetchedComment.rating);
        if (user_data.downvotedComments?.includes(commentId)) {
          setVoted('down');
        }
        else if (user_data.upvotedComments?.includes(commentId)) {
          setVoted('up');
        }
        else {
          setVoted(null);
        }
      } catch (error) {
        console.error('Error fetching comment:', error);
      }
    };
    fetchCommentData();
  }, []);

  // Function to handle upvote
  const handleUpvote = async () => {
    try {
      if (voted === 'up') {
        const res = await axios.put(`http://localhost:3000/comments/revoke/${commentId}`,[] ,{headers});
        setVotes(votes - 1);
        setVoted(null);
      }
      else if (voted === 'down') {
        const res = await axios.put(`http://localhost:3000/comments/upvote/${commentId}`,[] ,{headers});
        setVotes(votes + 2);
        setVoted('up');
      }
      else if (voted === null) {
        const res = await axios.put(`http://localhost:3000/comments/upvote/${commentId}`,[] ,{headers});
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
        const res = await axios.put(`http://localhost:3000/comments/revoke/${commentId}`,[] , {headers});
        setVotes(votes + 1);
        setVoted(null);
      }
      if (voted === 'up') {
        const res = await axios.put(`http://localhost:3000/comments/downvote/${commentId}`,[] , {headers});
        setVotes(votes - 2);
        setVoted('down');
      }
      if (voted === null) {
        const res = await axios.put(`http://localhost:3000/comments/downvote/${commentId}`,[] , {headers});
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

export default UpvoteDownvoteButtonComment;
