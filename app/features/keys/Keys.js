import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';
import Redis from 'ioredis';
import { Client } from 'ssh2';
import net from 'net';
import { addKey, addKeys, clearKeys } from './keysSlice';
import { addString } from '../values/stringContentSlice';
import StringContent from '../values/StringContent';
import HashContent from '../values/HashContent';
import { addHash } from '../values/hashContentSlice';

import Values from '../values/Values';
// import { remote } from 'electron';

const ioredis = require('ioredis');
const fs = require('fs');

let redis;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },

  buttons: {
    padding: 5,
  },
}));

const KeysMemo = React.memo(function keys({ keys, onSelectKey }) {
  return (
    <List component="nav" aria-label="keys">
      {keys.length === 0
        ? 'empty'
        : keys.map((key) => (
          <Grid container spacing={2} key={key}>
              <Grid item xs={12} sm={12}>
              <ListItem
                  button
                  key={key}
                  onClick={(event) => onSelectKey(key)}
                >
                  <ListItemText primary={key} />
                </ListItem>
            </Grid>
            </Grid>
          ))}
    </List>
  );
});

export default function Keys(props) {
  const classes = useStyles();

  const {redis} = props;
  const keys = useSelector((state) => state.keys);

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
    const type = await redis.type(key);
    // console.log(`called onSelectKey ${key}=${type}`);

    switch (type) {
      case 'string': {
        const value = await redis.get(key);
        console.log(`called onSelectKey ${key}=${value}`);
        onAddString(value);
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

  const onRemoveServer = (id) => {
    console.log(`called onRemoveServer=${id}`);
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
      <div className={classes.buttons}>
        <Button
          startIcon={<HomeIcon />}
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={(event) => scan()}
        >
          scan
        </Button>
      </div>

      <KeysMemo keys={keys} onSelectKey={onSelectKey} />
    </div>
  );
}
