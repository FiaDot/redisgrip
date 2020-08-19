import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import ServersToolbar from './ServerToolbar';
import ServerList from './ServerList';
import Keys from '../keys/Keys';
import Values from '../values/Values';
import { connectToServer } from './connectionSlice';

const drawerLeftWidth = 320;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawerLeft: {
    width: drawerLeftWidth,
    flexShrink: 0,
  },
  drawerPaperLeft: {
    width: drawerLeftWidth,
  },
  drawerRight: {
    width: '40%',
    flexShrink: 0,
  },
  drawerPaperRight: {
    width: '40%',
  },
  divKeys: {
    // display: 'flex',
    position: 'relative',
    width: 300,
    height: '100%',
    float: 'left',
    // overflowY: 'scroll',
  },
  divValues: {
    position: 'relative',
    //width: '50%',
    height: '100%',
    float: 'right',
    // display: 'flex',
    //float: 'left',
    //backgroundColor: red,
    overflowY: 'scroll',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
}));

export default function ServerSheet() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const connect = async () => {
    console.log('ServerSheet:connect()');

    const options = {
      host: '52.79.194.253',
      port: 6379,
      password: 'asdf1234!',
      connectTimeout: 10000,
      maxRetriesPerRequest: null,
    };

    dispatch(connectToServer(options));
  };

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Drawer
        className={classes.drawerLeft}
        variant="permanent"
        classes={{
          paper: classes.drawerPaperLeft,
        }}
        anchor="left"
      >
        <ServersToolbar connect={connect} />
        <ServerList connect={connect} />
      </Drawer>

      <Keys />

      <Drawer
        className={classes.drawerRight}
        variant="permanent"
        classes={{
          paper: classes.drawerPaperRight,
        }}
        anchor="right"
      >
        <Values />
      </Drawer>

    </div>
  );
}
