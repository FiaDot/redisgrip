import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { addServer, delServer } from './serversSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#eeeeee',
  },
  button: {
    margin: theme.spacing(0),
    // backgroundColor: '#0000cc',
    // borderColor: '#005cbf',
  },
  paper: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(32),
      height: theme.spacing(6),
      minWidth: 250,
      backgroundColor: '#eeeeee',
    },
  },
  title: {
    fontSize: 14,
  },
}));

export default function ServerToolbar() {
  const classes = useStyles();

  // TODO : 선택된 서버가 있다면 활성화
  const selectedId = useSelector((state) => state.selected.id);
  const selected = selectedId !== null;

  const dispatch = useDispatch();
  const onDelServer = (id) => dispatch(delServer(id));

  const del = () => {
    console.log(`called delServer=${selectedId}`);
    onDelServer(selectedId);
  };

  const edit = () => {
    console.log('called editServer');
  };

  const connect = () => {
    console.log('called connect');
  };

  const disconnect = () => {
    console.log('called disconnect');
  };

  return (
    <div className={classes.root}>
      <Typography
        className={classes.title}
        color="textSecondary"
        gutterBottom
        align="center"
      >
        Connections
      </Typography>

      <div className={classes.paper}>
        <Paper elevation={3}>
          {/* Add */}
          <Tooltip TransitionComponent={Zoom} title="Add">
            <IconButton
              variant="contained"
              className={classes.button}
              // onClick={add}
              component={Link}
              to="/AddServer"
            >
              <AddBoxOutlinedIcon color="primary" />
            </IconButton>
          </Tooltip>

          {/* Del */}
          <Tooltip TransitionComponent={Zoom} title="Delete">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={selected ? del : null}
            >
              <IndeterminateCheckBoxOutlinedIcon
                color={selected ? 'primary' : 'disabled'}
              />
            </IconButton>
          </Tooltip>

          {/* Edit */}
          <Tooltip TransitionComponent={Zoom} title="Edit">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={selected ? edit : null}
            >
              <EditOutlinedIcon color={selected ? 'primary' : 'disabled'} />
            </IconButton>
          </Tooltip>

          {/* Connect */}
          <Tooltip TransitionComponent={Zoom} title="Connect">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={selected ? connect : null}
            >
              <LinkOutlinedIcon color={selected ? 'primary' : 'disabled'} />
            </IconButton>
          </Tooltip>

          {/* Disconnect */}
          <Tooltip TransitionComponent={Zoom} title="Disconnect">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={selected ? disconnect : null}
            >
              <LinkOffOutlinedIcon color={selected ? 'primary' : 'disabled'} />
            </IconButton>
          </Tooltip>
        </Paper>
      </div>
    </div>
  );
}
