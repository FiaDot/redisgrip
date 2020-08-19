import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import PostAddOutlinedIcon from '@material-ui/icons/PostAddOutlined';
import DeleteSweepOutlinedIcon from '@material-ui/icons/DeleteSweepOutlined';
import TrackChangesOutlinedIcon from '@material-ui/icons/TrackChangesOutlined';
import Divider from '@material-ui/core/Divider';
import { addHash } from '../values/hashContentSlice';
import { addString } from '../values/stringContentSlice';
import { addKeys, clearKeys } from './keysSlice';
import { selectKey } from '../servers/selectedSlice';
import { addZset } from '../values/zsetContentSlice';
import { addList } from '../values/listContentSlice';
import { addSet } from '../values/setContentSlice';

import yellow from '@material-ui/core/colors/yellow';
import SearchKey from './SearchKey';
import AddKeyDialog from './AddKeyDialog';
import DelKeyDialog from './DelKeyDialog';
// import { remote } from 'electron';
// const ioredis = require('ioredis');

const useStyles = makeStyles((theme) => ({
  // root: {
  //   // width: '100%',
  //   width: 500,
  //   //maxWidth: 360,
  //   backgroundColor: theme.palette.background.default,
  //   overflowY: 'scroll',
  // },
  //button: {
  //   margin: theme.spacing(0),
  //   // backgroundColor: '#0000cc',
  //   // borderColor: '#005cbf',
  // },
  // paper: {
  //   display: 'flex',
  //   flexWrap: 'wrap',
  //   '& > *': {
  //     margin: theme.spacing(1),
  //     width: theme.spacing(32),
  //     height: theme.spacing(6),
  //     //minWidth: 250,
  //     backgroundColor: theme.palette.background.paper,
  //   },
  // },
  // title: {
  //   fontSize: 14,
  // },
  paper: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
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
}));

const KeysMemo = React.memo(function keys({ keys, onSelectKey, selectedKey }) {
  return (
    <div>
      {keys.map((key) => (
        <Grid container spacing={0} key={key}>
          <Grid item xs={12}>
            <ListItem
              button
              selected={selectedKey === key}
              key={key}
              onClick={(event) => onSelectKey(key)}
            >
              <VpnKeyOutlinedIcon
                color="primary"
                style={{ paddingRight: 10 }}
              />
              <ListItemText primary={key} />
            </ListItem>
            <Divider variant="middle" component="li" />
          </Grid>
        </Grid>
      ))}
    </div>
  );
});

export default function Keys() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const keys = useSelector((state) => state.keys);
  const selectedKey = useSelector((state) => state.selected.selectKey);

  const onSelectKey = async (key) => {
    dispatch(selectKey({key}));
  };

  const scan = async () => {
    dispatch(scanKeys());
  };

  return (
    <div className={classes.root}>
      <Typography
        className={classes.title}
        color="textSecondary"
        gutterBottom
        align="center"
      >
        Keys
      </Typography>

      <div className={classes.paper}>
        <Paper elevation={3}>
          {/* Refresh */}
          <Tooltip TransitionComponent={Zoom} title="Refresh">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={(event) => scan()}
            >
              <RefreshOutlinedIcon color="primary" />
            </IconButton>
          </Tooltip>

          {/* Add Key */}
          <AddKeyDialog />


          {/* Del key */}
          <DelKeyDialog />

          {/* Trace key */}
          <Tooltip TransitionComponent={Zoom} title="Trace Key">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={null}
            >
              <TrackChangesOutlinedIcon color={'disabled'} />
            </IconButton>
          </Tooltip>
        </Paper>
      </div>

      {/* Search bar */}
      <SearchKey />

      {/* Key List */}
      {keys.length <= 0 ? '' :
        // <Paper style={{ maxHeight: 500, overflowY: 'scroll' }}>
        <Paper>
          <List component="nav" aria-label="keys">
            <KeysMemo keys={keys} onSelectKey={onSelectKey} selectedKey={selectedKey} />
          </List>
        </Paper>
      }
    </div>
  );
}
