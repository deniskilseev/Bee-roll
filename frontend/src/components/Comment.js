import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Comment.css';

function Comment(props) {
    const [comment, setComment] = useState([]);
    const [date, setDate] = useState([]);
    const [user, setUser] = useState([]);
    const commentId = props.commentId;
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
            setUser(userResponse.data.user_info.login);
          } catch (error) {
            console.error('Error fetching comment data:', error);
          }
      };
    
        fetchCommentData();
      }, []);
    return (
        <div className="comment-container">
            <p className="comment-text">{comment.commentText}</p>
            <div className="comment-details">
                <span className="comment-user">{user}</span>
                <span className="comment-date">{date}</span>
            </div>
        </div>
    )
}

export default Comment;