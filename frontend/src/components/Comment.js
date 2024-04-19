import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Comment.css';
import UpvoteDownvoteButtonComment from './UpvoteDownvoteButtonComment'
import { useUser } from '../UserContext';

function Comment(props) {
    const [comment, setComment] = useState([]);
    const [date, setDate] = useState([]);
    const [userComment, setUserComment] = useState([]);
    const commentId = props.commentId;

    const { user } = useUser();
    const token = user.token;
    const userUid = user.userData.data_by_username.uid;
    useEffect(() => {
        const fetchCommentData = async () => {
          try {
            const response = await axios.get(`http://localhost:3000/comments/${commentId}`);
            const fetchedComment = response.data.comment;
            setComment(fetchedComment);
            const commentDate = new Date(fetchedComment.postingDate);
            const formattedDate = commentDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            console.log('Comment date', commentDate)
            const formattedTime = commentDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
            const formattedDateTime = `${formattedDate} at ${formattedTime}`;
            setDate(formattedDateTime);

            const userResponse = await axios.get(`http://localhost:3000/users/getUser/${fetchedComment.userId}`);
            setUserComment(userResponse.data.user_info.login);
          } catch (error) {
            console.error('Error fetching comment data:', error);
          }
      };
    
        fetchCommentData();
      }, [commentId]);

    const handleDeleteClick = (commentId) => {
      const isConfirmed = window.confirm("Are you sure you want to delete this post?");
      if (isConfirmed) {
        const headers = {
          'Authorization': `Bee-roll ${token}`,
          'Content-Type': 'application/json'
        };
  
        axios.delete(`http://localhost:3000/comments/deleteComment/`, { headers, data: {commentId: commentId} })
          .then(response => {
            console.log('Comment deleted successfully:', response.data);
          })
          .catch(error => {
            console.error('Error deleting comment:', error);
          });
      }
    };
    console.log("comment user", comment.userId);

    return (
        <div className="comment-container">
            <UpvoteDownvoteButtonComment commentId = {commentId}/>
            <p className="comment-text">{comment.commentText}</p>
            <div className="comment-details">
                <span className="comment-user">{userComment}</span>
                <span className="comment-date">{date}</span>
            </div>
            {comment.userId === userUid
              ? (<button className="btn btn-outline-danger" onClick={() => handleDeleteClick(commentId)}>Delete</button>)
              : (null)
            }
        </div>
    )
}

export default Comment;