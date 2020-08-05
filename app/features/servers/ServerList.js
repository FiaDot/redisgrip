import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import { selectServer } from './selectedSlice';
import { addServer } from './serversSlice';

const storage = require('electron-json-storage');
const { dialog, remote } = require('electron');

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const ServerListMemo = React.memo(function serverList({
  servers,
  selected,
  onSelectServer,
  onConnectServer,
  onEditServer,
  onRemoveServer,
}) {
  return (
    <div>
      <List component="nav" aria-label="main mailbox folders">
        {servers.length === 0
          ? '--- TODO : show empty message ---'
          : servers.map((server) => (
              <Grid container spacing={2} key={server.id}>
                <Grid item xs={12} sm={8}>
                  <ListItem
                    button
                    selected={selected === server.id}
                    key={server.id}
                    onClick={(event) => onSelectServer(server.id)}
                    onDoubleClick={(event) => onConnectServer(server.id)}
                  >
                    <ListItemText primary={server.name} />
                  </ListItem>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    fontSize="large"
                    color="primary"
                    aria-label="edit"
                    key={server.id}
                    onClick={(event) => onEditServer(server.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <IconButton
                    fontSize="large"
                    color="secondary"
                    aria-label="delete"
                    key={server.id}
                    onClick={(event) => onRemoveServer(server.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
      </List>
    </div>
  );
});

export default function ServerList() {
  const classes = useStyles();

  const servers = useSelector((state) => state.servers);
  const selected = useSelector((state) => state.selected);

  const dispatch = useDispatch();
  const onSelectServer = (id) => dispatch(selectServer(id));
  const onAddServer = (config) => dispatch(addServer(config));

  // TODO : 서버 목록 불러오기
  //
  // useEffect(() => {
  //   console.log('loaded ServerList');
  //
  //   // storage.clear();
  //
  //   storage.getAll(function(error, data) {
  //     if (error) throw error;
  //
  //     console.log(data);
  //     const keys = Object.keys(data);
  //
  //     keys.map((key) => {
  //         console.log(`useEffect id=${key} data=${JSON.stringify(data[key])}`);
  //         //onAddServer(data[key]);
  //         dispatch(addServer(data[key]));
  //     });
  //   });
  //
  //   return () => {
  //     console.log('unloaded ServerList');
  //   };
  // }, []);


  const onConnectServer = (id) => {
    // TODO : electron 연동시 redis 연결 시도!
  };

  const onEditServer = (id) => {
    console.log(`called onEditServer=${id}`);
  };

  const onRemoveServer = (id) => {
    console.log(`called onRemoveServer=${id}`);

    // // 경로
    // console.log(remote.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }));
    //
    // // 다양한 옵
    // const options = {
    //   type: 'question',
    //   buttons: ['Cancel', 'Yes, please', 'No, thanks'],
    //   defaultId: 2,
    //   title: 'Question',
    //   message: 'Do you want to do this?',
    //   detail: 'It does not really matter',
    //   checkboxLabel: 'Remember my answer',
    //   checkboxChecked: true,
    // };
    //
    // remote.dialog.showMessageBox(null, options, (response, checkboxChecked) => {
    //   console.log(response);
    //   console.log(checkboxChecked);
    // });
    //
    // // 단순 알림
    // const selectedPaths = remote.dialog.showErrorBox('test', 'aasd');
    // // eslint-disable-next-line no-console
    // console.log(selectedPaths);

  };

  return (
    <div className={classes.root}>
      {/*{*/}
      {/*  console.log(servers)*/}
      {/*}*/}

      <ServerListMemo
        servers={servers}
        selected={selected.id}
        onSelectServer={onSelectServer}
        onConnectServer={onConnectServer}
        onEditServer={onEditServer}
        onRemoveServer={onRemoveServer}
      />
    </div>
  );
}
