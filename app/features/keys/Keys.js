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
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import TextField from '@material-ui/core/TextField';
import { addHash } from '../values/hashContentSlice';
import { addString } from '../values/stringContentSlice';
import { addKey, addKeys, clearKeys } from './keysSlice';
import { selectKey } from '../servers/selectedSlice';
import Divider from '@material-ui/core/Divider';
// import { remote } from 'electron';
// const ioredis = require('ioredis');

const useStyles = makeStyles((theme) => ({
  // root: {
  //   width: '100%',
  //   maxWidth: 360,
  //   backgroundColor: theme.palette.background.paper,
  // },
  root: {
    width: '100%',
    maxWidth: 360,
    // backgroundColor: theme.palette.background.paper,
    overflowY: 'scroll',
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

export default function Keys(props) {
  const classes = useStyles();

  const { redis } = props;
  const keys = useSelector((state) => state.keys);
  const selectedKey = useSelector((state) => state.selected.selectKey);

  const dispatch = useDispatch();
  const onAddKey = (key) => dispatch(addKey(key));
  const onAddKeys = (keys) => dispatch(addKeys(keys));

  const onAddString = (value) => dispatch(addString({ keyName: value }));

  const onAddHas = (key, kv) =>
    dispatch(addHash({ keyName: key, content: kv }));

  // const onAddTest = () => {
  //   onAddKey('1');
  // };

  const makeKeyValueFromHash = async (raw) => {
    const kv = [];

    for (let n = 0; n < raw.length / 2; n += 1) {
      kv.push({ key: raw[n * 2], value: raw[n * 2 + 1] });
    }
    return kv;
  };

  const onSelectKey = async (key) => {
    dispatch(selectKey(key));

    const type = await redis.type(key);
    // console.log(`called onSelectKey ${key}=${type}`);

    switch (type) {
      case 'string': {
        const value = await redis.get(key);
        console.log(`called onSelectKey ${key}=${value}`);
        // onAddString(value);
        dispatch(addString({ keyName: key, content: value }))
        break;
      }
      case 'zset': {
        const count = await redis.zcard(key);
        console.log(`called onSelectKey ${key}=${count}`);
        const data = await redis.zrange(key, 0, count, 'WITHSCORES');
        console.log(`zset len=${data.length},data=${data} `);
        break;
      }
      case 'list': {
        const len = await redis.llen(key);
        const data = await redis.lrange(key, 0, len);
        console.log(`called onSelectKey ${key}=${data}`);
        break;
      }
      case 'set': {
        const len = await redis.scard(key);
        const data = await redis.sscan(key, 0, 'count', 10000);
        console.log(`called onSelectKey ${key}=${data}`);
        break;
      }
      case 'hash': {
        const len = await redis.hlen(key);
        const data = await redis.hscan(key, 0, 'COUNT', 10000);
        console.log(`called onSelectKey ${key}=${data}`);
        const kv = await makeKeyValueFromHash(data[1]);
        onAddHas(key, kv);
        break;
      }
      default:
        console.log('not matched type');
    }
  };

  const scan = async () => {
    const stream = await redis.scanStream({
      match: '*',
      count: 10000,
    });

    dispatch(clearKeys());

    stream.on('data', function (keys) {
      onAddKeys(keys);
    });

    // const monitor = await redis.monitor();
    // monitor.on('monitor', console.log);
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
          <Tooltip TransitionComponent={Zoom} title="Add Key">
            <IconButton
              variant="contained"
              className={classes.button}
              // onClick={add}
              component={Link}
              to="/AddKey"
            >
              <PostAddOutlinedIcon color="primary" />
            </IconButton>
          </Tooltip>

          {/* Del key */}
          <Tooltip TransitionComponent={Zoom} title="Delete Key">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={null}
            >
              <DeleteSweepOutlinedIcon color={'disabled'} />
            </IconButton>
          </Tooltip>

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
      <div className={classes.paper}>
        <Grid container spacing={0}>
          <Grid item xs={8}>
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              label="Search..."
              name="search"
              // value={search}
              // onChange={onChange}
              // disabled={disabled}
            />
          </Grid>

          <Grid item>
            <Tooltip TransitionComponent={Zoom} title="Search">
              <IconButton
                variant="contained"
                className={classes.button}
                onClick={null}
              >
                <SearchOutlinedIcon color={'primary'} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </div>

      {/* Key List */}
      {keys.length <= 0 ? '' :
        <Paper style={{ maxHeight: 500, overflowY: 'scroll' }}>
          <List component="nav" aria-label="keys">
            <KeysMemo keys={keys} onSelectKey={onSelectKey} selectedKey={selectedKey} />
          </List>
        </Paper>
      }
    </div>
  );
}
