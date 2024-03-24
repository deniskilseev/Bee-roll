// MovieCard.js
import React from 'react';
import { Card, Image } from 'semantic-ui-react';

const MovieCard = ({ title, thumbnailUrl }) => {
  return (
    <Card>
      <Image src={thumbnailUrl} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
      <Card.Content>
        <Card.Header>{title}</Card.Header>
      </Card.Content>
    </Card>
  );
};

export default MovieCard;
