import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const HomeScreen = () => {
  return (
    <Jumbotron>
      <h1>Hello!</h1>
      <p>Welcome to Elixir. A simple and secure way to share your health records online.</p>
      <p>
        <LinkContainer to='/register'>
          <Button variant='primary'>Join Now</Button>
        </LinkContainer>
      </p>
    </Jumbotron>
  );
};

export default HomeScreen;
