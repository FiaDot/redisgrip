import React from 'react';
import ServersToolbar from './ServerToolbar';
import ServerList from './ServerList';
import { Grid } from '@material-ui/core';
import Keys from '../keys/Keys';

export default function Servers() {
  return (
    <div>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <ServersToolbar />
            <ServerList />
          </Grid>

          <Grid item xs={3}>
            Key list
            <Keys />
          </Grid>

          <Grid item>
            Value List
          </Grid>
        </Grid>

    </div>
  );
}
