import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import ServerList from './ServerList';
import Keys from '../keys/Keys';
import Values from '../values/Values';
import { connectToServer, startConnecting } from './connectionSlice';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

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
  cardKey: {
    width: 400,
    height: 200,
    alignContent: 'center',
    alignItems: 'center',
    // display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
}));

export default function ServerSheet() {
  const classes = useStyles();

  const servers = useSelector((state) => state.servers);
  const selectedSeverId = useSelector((state) => state.selected.id);
  const isConnected = useSelector((state) => state.connections.connectResult);
  const isConnecting = useSelector((state) => state.connections.isConnecting);

  const dispatch = useDispatch();

  const connect = async () => {

    await dispatch(startConnecting());

    // 선택된 서버 목록의 id를 통해 실제 접속할 서버의 정보를 가져오도록!!!!
    // console.log(`selectedSeverId=${selectedSeverId}`);
    // console.log(`connectedId=${connectedId}`);
    const server = servers.find((record) => record.id === selectedSeverId);
    // console.log(`server=${JSON.stringify(server)}`);
    dispatch(connectToServer(server));
  };


  function showKeys() {
    return (
      <Keys />
    );
  };

  function showKeysCard() {
    return (
      <Container fixed>
          <Card className={classes.cardKey}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                No connected server
              </Typography>
              <Typography variant="h5" component="h2">
                Please double click a server in list.
              </Typography>

            </CardContent>
            <CardActions>
            </CardActions>
          </Card>
      </Container>
    );
  }


  function showValues() {
    return (
      <Drawer
        className={classes.drawerRight}
        variant="permanent"
        classes={{
          paper: classes.drawerPaperRight
        }}
        anchor="right"
      >
        <Values />
      </Drawer>
    );
  }

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
        <ServerList connect={connect} />
      </Drawer>

      {isConnected && !isConnecting ? showKeys() : showKeysCard()}
      {isConnected && !isConnecting ? showValues() : ''}
    </div>
  );
}
