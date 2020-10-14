import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import { SplitPane } from 'react-collapse-pane';
import cardicon_path from './cardicon.png';
import { connectToServer, setShowResult, startConnecting } from './connectionSlice';
import Values from '../values/Values';
import Keys from '../keys/Keys';
import ServerList from './ServerList';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { hidePopup } from './selectedSlice';

const drawerLeftWidth = 300;

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#EE313f', // '#FF0000', e0313f
    },
    secondary: {
      main: '#000000',
    },
  },
});

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
    // width: '50%',
    height: '100%',
    float: 'right',
    // display: 'flex',
    // float: 'left',
    // backgroundColor: red,
    overflowY: 'scroll',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
  cardKey: {
    // maxWidth: 400,
    width: 400,
    height: 300,
    alignContent: 'center',
    alignItems: 'center',
    // display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    left: '60%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  media: {
    // height: '50%',
    // paddingTop: '56.25%', // 16:9
    // width : 200,
    height: 200,
    // align: 'center',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function ServerSheet() {
  const classes = useStyles();

  const servers = useSelector((state) => state.servers);
  const selectedSeverId = useSelector((state) => state.selected.id);
  const isConnected = useSelector((state) => state.connections.connectResult);
  const isConnecting = useSelector((state) => state.connections.isConnecting);

  const isShowPopup = useSelector((state) => state.selected.isShowPopup);
  const popupMessage = useSelector((state) => state.selected.popupMessage);
  const popupSeverity = useSelector((state) => state.selected.popupSeverity);

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
    return <Keys />;
  }

  function showKeysCard() {
    return (
      <Container fixed>
        <Card className={classes.cardKey}>
          <CardMedia
            className={classes.media}
            component="img"
            // height="200"
            image={cardicon_path}
            title="notice"
          />
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              No connected server
            </Typography>
            <Typography variant="h5" component="h2">
              Please double click a server in list.
            </Typography>
          </CardContent>
          <CardActions />
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

  const connectResult = useSelector((state) => state.connections.connectResult);
  const showResult = useSelector((state) => state.connections.showResult);

  const onAlertClose = () => {
    dispatch(setShowResult(false));
  };

  const onPopupClose = () => {
    dispatch(hidePopup());
  };


  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <div className={classes.root}>
          <CssBaseline />

          {/*<SplitPane split="vertical" initialSizes={[30, 70]}>*/}
          {/*  <div>*/}
          {/*    <ServerList connect={connect} />*/}
          {/*  </div>*/}

          {/*  {*/}
          {/*    isConnected && !isConnecting*/}
          {/*      ?*/}
          {/*      <SplitPane split="vertical" initialSizes={[40, 60]}>*/}
          {/*        <div>*/}
          {/*          <Keys />*/}
          {/*        </div>*/}
          {/*        <div>*/}
          {/*          <Values />*/}
          {/*        </div>*/}
          {/*      </SplitPane>*/}
          {/*      :*/}
          {/*      <div>*/}
          {/*        { showKeysCard() }*/}
          {/*      </div>*/}
          {/*  }*/}

          {/*</SplitPane>*/}

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

          <Backdrop className={classes.backdrop} open={isConnecting}>
            <CircularProgress color="inherit" />
          </Backdrop>

          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={isShowPopup}
            onClose={onPopupClose}
            autoHideDuration={3000}
            key="popup"
          >
            <Alert onClose={onPopupClose} severity={popupSeverity}>
              {popupMessage}
            </Alert>
          </Snackbar>


          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={showResult}
            onClose={onAlertClose}
            autoHideDuration={3000}
            // message={connectResult ? 'Success' : 'Failed'}
            key="bottom left"
          >
            <Alert
              onClose={onAlertClose}
              severity={connectResult ? 'success' : 'error'}
            >
              Connection {connectResult ? 'Success' : 'Failed'}
            </Alert>
          </Snackbar>

          {isConnected && !isConnecting ? showKeys() : showKeysCard()}
          {isConnected && !isConnecting ? showValues() : ''}
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
