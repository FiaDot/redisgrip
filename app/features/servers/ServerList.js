import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import StorageOutlinedIcon from '@material-ui/icons/StorageOutlined';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { clearServers, loadStorage } from './serversSlice';
import { selectServer } from './selectedSlice';
import ServersToolbar from './ServerToolbar';

const useStyles = makeStyles((theme) => ({
  // root: {
  //   width: '100%',
  //   maxWidth: 360,
  //   backgroundColor: theme.palette.background.default,
  //   overflowY: 'scroll',
  // },
}));

const ServerListMemo = React.memo(function serverList({
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
        <ListItem
          button
          selected={selected === serverId}
          key={serverId}
          onClick={(event) => onSelectServer(serverId)}
          onDoubleClick={(event) => onConnectServer(serverId)}
        >
          <StorageOutlinedIcon
            color={connectedId === serverId ? 'secondary' : 'primary'}
            style={{ paddingRight: 10 }}
          />
          <ListItemText primary={serverAlias} />
        </ListItem>
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

  return (
    <>
      <ServersToolbar connect={props.connect} />

      <List component="nav" aria-label="servers">
        {servers.length === 0
          ? ''
          : servers.map((server) => (
              <ServerListMemo
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
