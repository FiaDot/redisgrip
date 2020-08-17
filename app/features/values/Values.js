import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AccessTimeOutlinedIcon from '@material-ui/icons/AccessTimeOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { clearString } from './stringContentSlice';
import Divider from '@material-ui/core/Divider';
import HashContent from './HashContent';
import StringContent from './StringContent';
import ZsetContent from './ZsetContent';
import ListContent from './ListContent';
import SetContent from './SetContent';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { deselectKey } from '../servers/selectedSlice';

// import { remote } from 'electron';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    //backgroundColor: theme.palette.background.default,
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
      // width: theme.spacing(32),
      // height: theme.spacing(26),
      minWidth: 250,
      backgroundColor: theme.palette.background.paper,
    },
  },
  divider: {
    margin: theme.spacing(1),
  },
  title: {
    fontSize: 24,
  },
  keyBar: {
    margin: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    //width: '40%',
    //maxWidth: 00,
    //maxHeight : 30,
    //color: 'white',
    //backgroundColor: 'black',
    backgroundColor: theme.palette.background.paper,
  },
  keyBarDivider: {
    height: 28,
    margin: 4,
  },
}));

export default function Values() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectKey = useSelector((state) => state.selected.selectKey);
  const selectType = useSelector((state) => state.selected.selectType);

  const clear = () => {
    dispatch(clearString());
  };


  const onDeselectKey = () => {
    dispatch(deselectKey());
  };

  function KeyInfo() {
    return (
      <Paper elevation={3} className={classes.keyBar}>

        <Tooltip TransitionComponent={Zoom} title="Clear">
          <IconButton type="submit" className={classes.iconButton} aria-label="deselect" onClick={onDeselectKey}>
            <CloseIcon color="primary" />
          </IconButton>
        </Tooltip>

        <Divider className={classes.keyBarDivider} orientation="vertical"/>

        <Typography variant="button" display="block" gutterBottom>
          {selectType}
        </Typography>

        <Divider className={classes.keyBarDivider} orientation="vertical"/>

        <Typography variant="subtitle1" display="block" gutterBottom>
          {selectKey}
        </Typography>

        <Divider className={classes.keyBarDivider} orientation="vertical"/>

        <Typography variant="subtitle1" display="block" gutterBottom align="right">
          TTL : 0
        </Typography>
      </Paper>
    );
  }

  return (
    <div className={classes.root}>
      <Typography
        color="textSecondary"
        variant="h5"
        gutterBottom
        align="center"
      >
        Value
      </Typography>


      <div className={classes.paper}>
        <Paper elevation={3}>
          <Tooltip TransitionComponent={Zoom} title="Reload">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={null}
            >
              <RefreshOutlinedIcon color="primary" />
            </IconButton>
          </Tooltip>

          <Tooltip TransitionComponent={Zoom} title="Save">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={null}
            >
              <SaveOutlinedIcon color="primary" />
            </IconButton>
          </Tooltip>

          <Tooltip TransitionComponent={Zoom} title="Edit">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={null}
            >
              <EditOutlinedIcon color="primary" />
            </IconButton>
          </Tooltip>

          <Tooltip TransitionComponent={Zoom} title="Set TTL">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={null}
            >
              <AccessTimeOutlinedIcon color="primary" />
            </IconButton>
          </Tooltip>

          <Tooltip TransitionComponent={Zoom} title="Delete">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={null}
            >
              <DeleteOutlineOutlinedIcon color="primary" />
            </IconButton>
          </Tooltip>

          <Tooltip TransitionComponent={Zoom} title="Clear">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={clear}
            >
              <ClearAllIcon color="primary" />
            </IconButton>
          </Tooltip>

        </Paper>
      </div>{/*<div className={classes.paper}>*/}

      { selectKey ? KeyInfo()  : '' }

      {/* key 타입에 따른 value 출력 */}
      {selectType === 'string' ? <StringContent /> : ''}
      {selectType === 'hash' ? <HashContent /> : ''}
      {selectType === 'list' ? <ListContent /> : ''}
      {selectType === 'zset' ? <ZsetContent /> : ''}
      {selectType === 'set' ? <SetContent /> : ''}
    </div>
  );
}
