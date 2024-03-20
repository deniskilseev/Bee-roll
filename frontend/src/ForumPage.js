import React from 'react';
import { useParams } from 'react-router-dom';

const ForumPage = ({ forums }) => {
  const { forumName } = useParams();

  const forum = forums.find((forum) => forum.name === forumName);

  if (!forum) {
    return <div>Forum not found!</div>;
  }

  const dummyPosts = [
    { id: 1, title: 'Post 1', content: 'Content of post 1' },
    { id: 2, title: 'Post 2', content: 'Content of post 2' },
    { id: 3, title: 'Post 3', content: 'Content of post 3' },
  ];

  return (
    <div className="container mt-5">
      <h1>{forum.title}</h1>

      <div className="mb-3">
        <button className="btn btn-primary">Create Post</button>
      </div>

      {dummyPosts.map((post) => (
        <div key={post.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text">{post.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumPage;
