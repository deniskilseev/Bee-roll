import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Comment from './Comment'
import { useUser } from '../UserContext';
import config from '../config';


function CommentWindow(props) {
    const [inputValue, setInputValue] = useState('');

    const postId = props.postId;

    const handleChange = (event) => {
      setInputValue(event.target.value);
    };

    const { user } = useUser();
    const token = user.token;

    const handleCommentClick = () => {
        const headers = {
            'Authorization': `Bee-roll ${token}`,
            'Content-Type': 'application/json'
          };

        const data = {
            postId: postId,
            commentText: inputValue
        };

        axios.post(`${config.apiBaseUrl}/comments/createComment`, data, { headers })
            .then(response => {
                console.log('Created comment successfully:', response.data);
                window.location.reload();
            })
            .catch(error => {
                console.error('Error pinning post:', error);
            });
    }

    return (
      <div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={inputValue}
            onChange={handleChange}
            placeholder="Write a comment here"
          />
          <div className="input-group-append">
            <button className="btn btn-outline-primary" onClick={() => handleCommentClick(postId)}>Comment</button>
          </div>
        </div>
      </div>
    );
  }

function CommentSection(props) {
    const commentIds = props.commentIds;
    const postId = props.postId;
    return (
        <div>
            <h6>Comments</h6>
            {commentIds.reverse().map((commentId) => (
                <div key = {commentId}>
                    <Comment commentId = {commentId}/>
                </div>
            ))}
            <CommentWindow postId = {postId}/>
        </div>
    )
}

export default CommentSection;