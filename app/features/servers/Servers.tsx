import React from 'react';
import ServersToolbar from './ServerToolbar';
import ServerList from './ServerList';

export default function Servers() {
  return (
    <div>
      <ServersToolbar />
      <ServerList />
    </div>
  );
}
