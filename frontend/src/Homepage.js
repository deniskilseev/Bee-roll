import React from 'react';
import PostList from './components/PostList';

const HomePage = ({ user }) => {
    const dummyUser2 = {
    id: 1,
    username: 'janedoe',
    bio: 'Example bio',
    email: 'jane.doe@example.com',
    profilePicture: 'blank profile pic.jpg',
    followers: [1, 2, 3, 4, 5],
    following: [1, 2, 3, 4],
  };

  dummyUser2.posts = [
    { id: 3, title: 'Third Post', content: 'third post.', author: dummyUser2 },
  ];

  const examplePosts = [
    user.posts[0],
    user.posts[1],
    dummyUser2.posts[0],
  ];

  return (
    <div>
      <div className="container mt-3">
        <PostList posts={examplePosts} />
      </div>
    </div>
  );
};

export default HomePage;