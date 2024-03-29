import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ForumPage = ({ forums, currentUser }) => {
  const { forumName } = useParams();

  const [forum, setForum] = useState(null);
  const [moderators, setModerators] = useState([]);
  const [newModerator, setNewModerator] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const fetchForumData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/forums/${forumName}`);
        const fetchedForum = response.data;
        setForum(fetchedForum);
        setModerators(fetchedForum.moderatorIds || []);
        setIsOwner(currentUser === fetchedForum.owner);
      } catch (error) {
        console.error('Error fetching forum:', error);
      }
  };

    fetchForumData();
  }, [forumName, currentUser]);

  useEffect(() => {
    if (!forum) return;

    const fetchPostData = async () => {
    try {
      const postsData = await Promise.all(
        forum.postIds.map(async (postId) => {
          const response = await axios.get(`http://localhost:3000/posts/getPost/${postId}`);
          const postData = response.data;
          console.log(postData.post_info.userId)
          const userResponse = await axios.get(`http://localhost:3000/users/getuser/${postData.post_info.userId}`);
          const userData = userResponse.data;
          return { ...postData, user: userData };
        })
      );
      
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
    fetchPostData();
  }, [forum]);

  if (!forum) {
    return <div>Forum not found!</div>;
  }

  const handlePinClick = (postId) => {
    axios.post('http://localhost:3000/posts/pinPost', { postId: postId, forumId: forum.forumId })
      .then(response => {
        console.log('Post pinned successfully:', response.data);
      })
      .catch(error => {
        console.error('Error pinning post:', error);
      });
  };

  const handleAddModerator = () => {
    if (newModerator && !moderators.includes(newModerator)) {
      setModerators([...moderators, newModerator]);
      setNewModerator('');
    }
  };

  const handleDeleteClick = (postId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    if (isConfirmed) {
      axios.delete(`http://localhost:3000/posts/deletePost/${postId}`)
        .then(response => {
          console.log('Post deleted successfully:', response.data);
        })
        .catch(error => {
          console.error('Error deleting post:', error);
        });
    }
  };

  const reorderPosts = (posts, pinnedPostId) => {
    if (!pinnedPostId || !posts || posts.length === 0) {
      return posts;
    }
    
    const pinnedPostIndex = posts.findIndex(post => post.post_info.postId === pinnedPostId);
    if (pinnedPostIndex === -1) {
      return posts;
    }
    
    const pinnedPost = posts.splice(pinnedPostIndex, 1)[0];
    return [pinnedPost, ...posts];
  };

  console.log(posts)
  
  return (
    <div className="container mt-5">
      <h1>{forum.title}</h1>

      
      <div className="mb-3">
        <Link to={`/forums/${forum.forumId}/createpost`} className="btn btn-primary">Create Post</Link>
      </div>

      {isOwner && (
        <div className="mb-3">
          <button className="btn btn-primary" onClick={() => setIsSearchVisible(!isSearchVisible)}>
            {isSearchVisible ? 'Hide Moderator Search' : 'Show Moderator Search'}
          </button>
        </div>
      )}

      {isOwner && isSearchVisible && (
        <div className="mb-3">
        <div className="input-group">
          <input
            type="text"
            value={newModerator}
            onChange={(e) => setNewModerator(e.target.value)}
            className="form-control"
            placeholder="Enter username of new moderator"
          />
          <div className="input-group-append">
            <button className="btn btn-success" onClick={handleAddModerator}>Add Moderator</button>
          </div>
        </div>
      </div>
      )}

      <div>
        <h3>Moderators:</h3>
        <ul>
          {moderators.map((moderator, index) => (
            <li key={index}>{moderator}</li>
          ))}
        </ul>
      </div>

      <h2>Posts</h2>
      {/* Currently does not show username or profile picture */}
      {reorderPosts(posts, forum.pinnedPost).map((post) => (
        <div key={post.post_info.postId} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{post.post_info.postTitle}</h5>
            <p className="card-text">{post.post_info.postText}</p>
            <Link to={{ pathname: `/user/profile/${post.user.user_info.login}` }}>
              {post.user && <p>Posted by: {post.user.user_info.login}</p>}
            </Link>
            <button className="btn btn-outline-primary mr-2" onClick={() => handlePinClick(post.post_info.postId)}>Pin</button>
            <button className="btn btn-outline-danger" onClick={() => handleDeleteClick(post.post_info.postId)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumPage;
