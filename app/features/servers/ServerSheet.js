import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import ServersToolbar from './ServerToolbar';
import ServerList from './ServerList';
import Keys from '../keys/Keys';
import Values from '../values/Values';
import { connectToServer } from './connectionSlice';
import { selectServer } from './selectedSlice';

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

  const servers = useSelector((state) => state.servers);
  const selectedSeverId = useSelector((state) => state.selected.id);
  const connectedId = useSelector((state) => state.connections.config.id);

  const dispatch = useDispatch();
  const onSelectServer = (id) => dispatch(selectServer(id));

  const connect = async () => {
    //console.log(`servers=${JSON.stringify(servers)}`);
    console.log(`selectedSeverId=${selectedSeverId}`);
    console.log(`connectedId=${connectedId}`);

    const server = servers.find(
      (record) => record.id === selectedSeverId
    );

    console.log(`server=${JSON.stringify(server)}`);
    // TODO : 선택된 서버 목록의 id를 통해 실제 접속할 서버의 정보를 가져오도록!!!!

    // const options = {
    //   host: '52.79.194.253',
    //   port: 6379,
    //   password: 'asdf1234!',
    //   connectTimeout: 10000,
    //   maxRetriesPerRequest: null,
    // };
    //
    dispatch(connectToServer(server));
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
