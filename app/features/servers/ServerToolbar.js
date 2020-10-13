import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';
import LinkOffOutlinedIcon from '@material-ui/icons/LinkOffOutlined';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { clearStorage, createServer, delServer } from './serversSlice';
import { deselectKey, deselectServer, isSelectedServer } from './selectedSlice';
import { clearKeys } from '../keys/keysSlice';
import { disconnected } from './connectionSlice';
import EditServerDialog from './EditServerDialog';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // width: 500,
    // maxWidth: 360,
    backgroundColor: theme.palette.background.default,
    overflowY: 'scroll',
  },
  button: {
    // width: 32,
    // height: 32,
    // padding: theme.spacing(1),
  },
  buttonIcon: {
    fontSize: '', // small, large
  },
  paper: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    // zIndex: 3000,
    // display: 'flex',
    // flexWrap: 'wrap',
    // '& > *': {
    //   margin: theme.spacing(1),
    //   width: theme.spacing(32),
    //   height: theme.spacing(6),
    //   minWidth: 300,
    //   backgroundColor: theme.palette.background.paper,
    // },
  },
  paperDisabled: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.action.disabledBackground, // theme.palette.secondary.main,
    // backgroundColor: theme.palette.background.paper,
  },
}));

export default function ServerToolbar(props) {
  const classes = useStyles();

  const servers = useSelector((state) => state.servers);
  const selectedId = useSelector((state) => state.selected.id);
  const isSelected = useSelector(isSelectedServer);
  const isConnected = useSelector((state) => state.connections.connectResult);
  const isConnecting = useSelector((state) => state.connections.isConnecting);

  const dispatch = useDispatch();
  const onDelServer = (id) => dispatch(delServer(id));
  const onDeselectServer = () => dispatch(deselectServer());

  const del = () => {
    onDelServer(selectedId);
    onDeselectServer();
  };

  const edit = () => {
    console.log('called editServer');
  };

  const onConnect = () => {
    console.log(`ServerToolBar onConnect() isConnected=${isConnected}`);
    props.connect();
  };

  const disconnect = () => {
    console.log('called disconnect');

    dispatch(disconnected());
    dispatch(deselectKey());
    dispatch(clearKeys());
  };

  const clear = () => {
    dispatch(clearStorage());
  };

  const copy = () => {
    const node = servers.find((server) => server.id === selectedId);

    let payload = {...node};
    delete payload.id;
    payload.alias = payload.alias + '_copied';

    dispatch(createServer(payload));
  }

  const EnabledToolbar = () => (
    <div className={classes.paper}>
      <Paper elevation={3}>
        {/* Add */}
        <Tooltip TransitionComponent={Zoom} title="Add">
          <IconButton
            // variant="contained"
            className={classes.button}
            // onClick={add}
            component={Link}
            to="/AddServer"
            disabled={isConnecting}
          >
            <AddBoxOutlinedIcon
              className={classes.buttonIcon}
              color={!isConnecting ? 'primary' : 'disabled'}
            />
          </IconButton>
        </Tooltip>

        {/* Del */}
        <Tooltip TransitionComponent={Zoom} title="Delete">
          <IconButton
            variant="contained"
            className={classes.button}
            onClick={isSelected ? del : null}
            disabled={isConnecting}
          >
            <IndeterminateCheckBoxOutlinedIcon
              className={classes.buttonIcon}
              color={isSelected ? 'primary' : 'disabled'}
            />
          </IconButton>
        </Tooltip>

        {/* Edit */}
        {/*<EditServerDialog />*/}
        <Tooltip TransitionComponent={Zoom} title="Edit">
          <IconButton
            className={classes.button}
            component={Link}
            to="/EditServer"
          >
            <EditOutlinedIcon
              className={classes.buttonIcon}
              color={isSelected ? 'primary' : 'disabled'}
            />
          </IconButton>
        </Tooltip>

        {/* Copy */}
        <Tooltip TransitionComponent={Zoom} title="Copy">
          <IconButton
            variant="contained"
            className={classes.button}
            onClick={isSelected ? copy : null}
            disabled={isConnecting}
          >
            <FileCopyOutlinedIcon
              className={classes.buttonIcon}
              color={isSelected ? 'primary' : 'disabled'}
            />
          </IconButton>
        </Tooltip>

        {/* Connect */}
        <Tooltip TransitionComponent={Zoom} title="Connect">
          <IconButton
            variant="contained"
            className={classes.button}
            // onClick={isSelected ? connect : null}
            onClick={isSelected && !isConnected ? onConnect : null}
          >
            <LinkOutlinedIcon
              className={classes.buttonIcon}
              color={isSelected && !isConnected ? 'primary' : 'disabled'}
            />
          </IconButton>
        </Tooltip>

        {/* Disconnect */}
        <Tooltip TransitionComponent={Zoom} title="Disconnect">
          <IconButton
            variant="contained"
            className={classes.button}
            onClick={isConnected ? disconnect : null}
            disabled={isConnecting}
          >
            <LinkOffOutlinedIcon
              className={classes.buttonIcon}
              color={isConnected ? 'primary' : 'disabled'}
            />
          </IconButton>
        </Tooltip>

        {/* Clear */}
        <Tooltip
          className={classes.tooltip}
          TransitionComponent={Zoom}
          title="Clear"
        >
          <IconButton
            variant="contained"
            className={classes.button}
            onClick={clear}
            disabled={isConnecting}
          >
            <ClearAllIcon className={classes.buttonIcon} color="secondary" />
          </IconButton>
        </Tooltip>
      </Paper>
    </div>
  );

  const DisabledToolbar2 = () => <div>test</div>;

  const DisabledToolbar = () => (
    <div>
      <Paper elevation={3} className={classes.paperDisabled}>
        {/* Add */}
        <Tooltip TransitionComponent={Zoom} title="Add">
          <IconButton className={classes.button} disabled>
            <AddBoxOutlinedIcon
              className={classes.buttonIcon}
              color="disabled"
            />
          </IconButton>
        </Tooltip>

        {/* Del */}
        <Tooltip TransitionComponent={Zoom} title="Delete">
          <IconButton variant="contained" className={classes.button} disabled>
            <IndeterminateCheckBoxOutlinedIcon
              className={classes.buttonIcon}
              color="disabled"
            />
          </IconButton>
        </Tooltip>

        {/* Edit */}
        <Tooltip TransitionComponent={Zoom} title="Edit">
          <IconButton variant="contained" className={classes.button} disabled>
            <EditOutlinedIcon className={classes.buttonIcon} color="disabled" />
          </IconButton>
        </Tooltip>

        {/* Connect */}
        <Tooltip TransitionComponent={Zoom} title="Connect">
          <IconButton variant="contained" className={classes.button} disabled>
            <LinkOutlinedIcon className={classes.buttonIcon} color="disabled" />
          </IconButton>
        </Tooltip>

        {/* Disconnect */}
        <Tooltip TransitionComponent={Zoom} title="Disconnect">
          <IconButton variant="contained" className={classes.button} disabled>
            <LinkOffOutlinedIcon
              className={classes.buttonIcon}
              color="disabled"
            />
          </IconButton>
        </Tooltip>

        {/* Clear */}
        <Tooltip
          className={classes.tooltip}
          TransitionComponent={Zoom}
          title="Clear"
        >
          <IconButton variant="contained" className={classes.button} disabled>
            <ClearAllIcon className={classes.buttonIcon} color="disabled" />
          </IconButton>
        </Tooltip>
      </Paper>
    </div>
  );

  return (
    <div>
      <Typography
        className={classes.title}
        color="textSecondary"
        gutterBottom
        align="center"
      >
        Connections
      </Typography>

      {isConnecting ? DisabledToolbar() : EnabledToolbar()}
    </div>
  );
}
