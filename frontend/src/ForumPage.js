import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';
import CommentSection from './components/CommentSection'
import UpvoteDownvoteButton from './components/UpvoteDownvoteButton'


const ForumPage = () => {
  const { forumName } = useParams();
  const navigate = useNavigate();

  const [forum, setForum] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showSpoilersMap, setShowSpoilersMap] = useState({});

  const { user } = useUser();
  const token = user.token;

  const handleSettingsClick = () => {
    // Navigate to forum settings page when settings button is clicked
    navigate(`/forums/${forumName}/settings`);
  };

  useEffect(() => {
    const fetchForumData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/forums/${forumName}`);
        const fetchedForum = response.data;
        setForum(fetchedForum);
        setIsOwner(user.userData.data_by_username.uid === fetchedForum.creatorId);
        const isUserModerator = fetchedForum.moderatorIds.includes(user.userData.data_by_username.uid);
        setIsModerator(isUserModerator);
      } catch (error) {
        console.error('Error fetching forum:', error);
      }
    };

    fetchForumData();
  }, [forumName, user]);

  useEffect(() => {
    if (!forum) return;

    const fetchPostData = async () => {
      try {
        const postsData = await Promise.all(
          forum.postIds.map(async (postId) => {
            const headers = {
              'Authorization': `Bee-roll ${token}`,
              'Content-Type': 'application/json'
            };

            const response = await axios.get(`http://localhost:3000/posts/getPost/${postId}`, { headers });
            const postData = response.data;

            const reviewsResponse = await axios.get(`http://localhost:3000/reviews/getPostReviews/${postId}`);
            const reviewsData = reviewsResponse.data;

            const combinedData = { ...postData, reviews: reviewsData.review_list[0] };

            const userResponse = await axios.get(`http://localhost:3000/users/getuser/${postData.post_info.userId}`);
            const userData = userResponse.data;
            return { ...combinedData, user: userData };
          })
        );

        const movieTitlePromises = postsData.map(async (post) => {
          if (post.reviews) {
            try {
              const response = await axios.get(`http://localhost:3000/movies/getInfo/${post.reviews.movieId}`);
              const movieTitle = response.data.movie_data.title;
              return { ...post, movieTitle: movieTitle };
            } catch (error) {
              console.error(`Error fetching movie title for postId ${post.post_info.postId}:`, error);
              return { ...post, movieTitle: 'Error: Title not found' };
            }
          } else {
            return { ...post, movieTitle: null };
          }
        });

        const postsWithData = await Promise.all(movieTitlePromises);
        setPosts(postsWithData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPostData();
  }, [forum, token]);

  if (!forum) {
    return <div>Forum not found!</div>;
  }
  const followForum = () => {
    const headers = {
      'Authorization': `Bee-roll ${token}`,
      'Content-Type': 'application/json'
    };
    axios.post('http://localhost:3000/forums/joinForum', { forumId: forum.forumId }, { headers })
      .then(response => {
        console.log('Forum followed successfully:', response.data);
      })
      .catch(error => {
        console.error('Error following forum:', error);
      });
  };

  const handlePinClick = (postId) => {
    const headers = {
      'Authorization': `Bee-roll ${token}`,
      'Content-Type': 'application/json'
    };

    axios.post('http://localhost:3000/posts/pinPost', { postId: postId, forumId: forum.forumId }, { headers })
      .then(response => {
        console.log('Post pinned successfully:', response.data);
      })
      .catch(error => {
        console.error('Error pinning post:', error);
      });
  };

  const handleDeleteClick = (postId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    if (isConfirmed) {
      const headers = {
        'Authorization': `Bee-roll ${token}`,
        'Content-Type': 'application/json'
      };

      axios.delete(`http://localhost:3000/posts/deletePost/${postId}`, { headers })
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

  const handleShowSpoilers = (postId) => {
    setShowSpoilersMap(prevState => ({
      ...prevState,
      [postId]: true
    }));
  };

  const handleViolateClick = (postId) => {
    const headers = {
      'Authorization': `Bee-roll ${token}`,
      'Content-Type': 'application/json'
    };
    
    axios.post('http://localhost:3000/posts/toggleViolate', { postId: postId }, { headers })
      .then(response => {
        console.log('Post flagged successfully:', response.data);
      })
      .catch(error => {
        console.error('Error flagging Post:', error);
      });

  }
  
  return (
    <div className="container mt-5">
      <h1>{forum.title}</h1>

      {isOwner && (
        <div className="mb-3">
          <button className="btn btn-primary" onClick={handleSettingsClick}>
            Forum Settings
          </button>
        </div>
      )}

      <div className="mb-3">
        <Link to={`/forums/${forum.forumId}/createpost`} className="btn btn-primary">Create Post</Link>
      </div>

      {!isOwner && (
        <div className="mb-3">
          <button className="btn btn-primary" onClick={followForum}>Follow</button>
        </div>
      )}

      <h2>Posts</h2>
      {/* Currently does not show username or profile picture */}
      {reorderPosts(posts, forum.pinnedPost).map((post) => {
          if (isOwner || isModerator || !post.post_info.isViolating) {
              return (
        <div key={post.post_info.postId} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title"><strong>{post.post_info.postTitle}</strong></h5>
            <UpvoteDownvoteButton postId = {post.post_info.postId}/>
            {showSpoilersMap[post.post_info.postId] || !post.post_info.containsSpoilers ? (
              <p className="card-text">{post.post_info.postText}</p>
            ) : (
              <button className="btn btn-primary mb-2" onClick={() => handleShowSpoilers(post.post_info.postId)}>Show spoilers</button>
            )}
            <Link to={{ pathname: `/user/profile/${post.user.user_info.login}` }}>
              {post.user && <p>Posted by: {post.user.user_info.login}</p>}
            </Link>
            {post.reviews && (
              <div>
                <strong>Review:</strong>
                <p>Movie Title: {post.movieTitle}</p>
                <p>Rating: {post.reviews.review}</p>
              </div>
            )}
            {(isOwner || isModerator) && (
              <>
                <button className="btn btn-outline-primary mr-2" onClick={() => handlePinClick(post.post_info.postId)}>Pin</button>
                <button className="btn btn-outline-danger" onClick={() => handleDeleteClick(post.post_info.postId)}>Delete</button>
                <button className="btn btn-outline-danger" onClick={() => handleViolateClick(post.post_info.postId)}>{post.post_info.isViolating ? 'Unflag' : 'Flag'}</button>
              </>
            )}
            <div style={{ marginBottom: '10px' }}></div>
            <CommentSection commentIds={post.post_info.commentIds} postId={post.post_info.postId} />
          </div>
        </div> 
      
          );
          }
          else {
            return (
                <>
                </>
            );
          }
      })}
    </div>
  );
};

export default ForumPage;
