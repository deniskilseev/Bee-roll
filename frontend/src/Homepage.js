import React from 'react';
import PostList from './components/PostList';

const HomePage = () => {
  const dummyUser = {
    id: 1,
    username: 'johndoe',
    bio: 'Example bio',
    email: 'john.doe@example.com',
    profilePicture: 'blank profile pic.jpg',
    followers: [1, 2, 3, 4],
    following: [1, 2, 3],
  };

  dummyUser.posts = [
    { id: 1, title: 'First Post', content: 'First post.', author: dummyUser},
    { id: 2, title: 'Second Post', content: 'Second post.', author: dummyUser},
  ];

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
    { id: 1, title: 'First Post', content: 'First post.', author: dummyUser2 },
    { id: 2, title: 'Second Post', content: 'Second post.', author: dummyUser2 },
  ];

  const examplePosts = [
    { id: 1, title: 'First Post', content: 'First post.', author: dummyUser },
    { id: 2, title: 'Second Post', content: 'Second post.', author: dummyUser2 },
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