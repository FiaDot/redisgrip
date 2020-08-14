import React from 'react';
import { Redirect } from 'react-router-dom/esm/react-router-dom';

export default function Home(): JSX.Element {
  return (
    <Redirect push to="/counter" />
  );
}
