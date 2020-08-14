import React from 'react';
import { Redirect } from 'react-router-dom/esm/react-router-dom';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';

export default function Home(): JSX.Element {
  return (
    <div>
      <h2>Home</h2>
      <Link to={routes.COUNTER}> to Counter</Link>
      <Link to={routes.ADDSERVER}> to Add Servers</Link>
      <Link to={routes.REDISGRIP}> to Servers</Link>
    </div>
  );
}
