import React, { Fragment } from 'react';
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
        {servers.length == 0
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

  const onConnectServer = (id) => {
    // TODO : electron 연동시 redis 연결 시도!
  };

  const onEditServer = (id) => {
    console.log(`called onEditServer=${id}`);
  };

  const onRemoveServer = (id) => {
    console.log(`called onRemoveServer=${id}`);
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
