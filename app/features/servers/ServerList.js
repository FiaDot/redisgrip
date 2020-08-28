import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import DesktopAccessDisabledOutlinedIcon from '@material-ui/icons/DesktopAccessDisabledOutlined';
import DesktopMacOutlinedIcon from '@material-ui/icons/DesktopMacOutlined';
import { clearServers, loadStorage } from './serversSlice';
import { selectServer } from './selectedSlice';
import ServersToolbar from './ServerToolbar';
import { setShowResult } from './connectionSlice';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  // root: {
  //   width: '100%',
  //   maxWidth: 360,
  //   backgroundColor: theme.palette.background.default,
  //   overflowY: 'scroll',
  // },
}));


const serverInfoTooltip = (server) => {
  const redis =`HOST=${server.host}:${server.port}`;

  if ( server.sshActive ) {
    const ssh = `SSH=${server.sshHost}:${server.sshPort}`;
    return redis + ssh;
  }

  return redis;
};

const serverTooltip = (server) => (
  <Fragment>
    <Typography variant="caption" display="block" gutterBottom>
      {`REDIS= ${server.host}:${server.port}`}
    </Typography>

    {server.sshActive ?
      <Typography variant="caption" display="block" gutterBottom>
        {`SSH= ${server.sshHost}:${server.sshPort}`}
      </Typography>
      : ''}
  </Fragment>
);

const ServerListMemo = React.memo(function serverList({
  server,
  serverId,
  serverAlias,
  selected,
  connectedId,
  onSelectServer,
  onConnectServer,
}) {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Grid container spacing={0} key={serverId}>
      <Grid item xs={12}>
        <Tooltip TransitionComponent={Zoom} title={serverTooltip(server)}>
          <ListItem
            button
            selected={selected === serverId}
            key={serverId}
            onClick={(event) => onSelectServer(serverId)}
            onDoubleClick={(event) => onConnectServer(serverId)}
          >
            {connectedId === serverId
              ? <DesktopMacOutlinedIcon fontSize="large" color="secondary" style={{ paddingRight: 10 }} />
              : <DesktopAccessDisabledOutlinedIcon fontSize="large" color="primary" style={{ paddingRight: 10 }} />
            }
            <ListItemText primary={serverAlias} />
          </ListItem>
        </Tooltip>
      </Grid>
    </Grid>
  );
});

// const ServerListMemo = React.memo(function serverList(
//   servers,
//   selected,
//   onSelectServer,
//   onConnectServer,
// ) {
//   return (
//     // eslint-disable-next-line react/jsx-filename-extension
//
//   );
// });

export default function ServerList(props) {
  const classes = useStyles();

  const servers = useSelector((state) => state.servers);
  const selected = useSelector((state) => state.selected);
  const connectedId = useSelector((state) => state.connections.config.id);

  const isConnecting = useSelector((state) => state.connections.isConnecting);
  const connectResult = useSelector((state) => state.connections.connectResult);
  const showResult = useSelector((state) => state.connections.showResult);

  const dispatch = useDispatch();
  const onSelectServer = (id) => dispatch(selectServer(id));

  useEffect(() => {
    console.log('loaded ServerList');

    // 서버 목록 불러오기
    dispatch(loadStorage());

    return () => {
      console.log('unloaded ServerList');
      dispatch(clearServers());
    };
  }, []);

  const onConnectServer = (id) => {
    console.log(`called onConnectServer=${id}`);
    // TODO : 실제 접속
    // dispatch(connectToServer());
    props.connect();
  };

  const onAlertClose = () => {
    dispatch(setShowResult(false));
  };

  return (
    <>
      <Backdrop className={classes.backdrop} open={isConnecting}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={showResult}
        onClose={onAlertClose}
        autoHideDuration={3000}
        // message={connectResult ? 'Success' : 'Failed'}
        key="bottom center"
      >
        <Alert
          onClose={onAlertClose}
          severity={connectResult ? 'success' : 'error'}
        >
          Connection {connectResult ? 'Success' : 'Failed'}
        </Alert>
      </Snackbar>

      <ServersToolbar connect={props.connect} />

      <List component="nav" aria-label="servers">
        {servers.length === 0
          ? ''
          : servers.map((server) => (
              <ServerListMemo
                server={server}
                key={server.id}
                serverId={server.id}
                serverAlias={server.alias}
                selected={selected.id}
                connectedId={connectedId}
                onSelectServer={onSelectServer}
                onConnectServer={onConnectServer}
            />
            ))}
      </List>
    </>
  );
}
