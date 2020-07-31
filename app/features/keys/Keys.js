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
import { addKey, addKeys } from './keysSlice';

const ioredis = require('ioredis');

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

export default function Keys() {
  const classes = useStyles();

  const keys = useSelector((state) => state.keys);

  const dispatch = useDispatch();
  const onAddKey = (key) => dispatch(addKey(key));
  const onAddKeys = (keys) => dispatch(addKeys(keys));

  const onAddTest = () => {
    onAddKey('1');
  };

  const onSelectKey = (key) => {
    console.log(`called onSelectKey=${key}`);
  };

  const onRemoveServer = (id) => {
    console.log(`called onRemoveServer=${id}`);
  };

  const connect = async () => {
    console.log(`called connect and ping function`);

    const testHost = '52.78.184.2';

    const redis = new ioredis({
      port: 6379, // Redis port
      host: testHost, // Redis host
      family: 4, // 4 (IPv4) or 6 (IPv6)
      password: 'asdf1234!',
      db: 0,
    });

    redis.ping((err, res) => {
      if (err) {
        console.log('err');
        console.log(err.message);
      } else {
        console.log('success');
      }
    });

    const stream = await redis.scanStream({
      match: '*',
      count: 10000,
    });

    // onAddKey('123');

    // eslint-disable-next-line func-names
    stream.on('data', function (keys) {
      // console.log(keys[0]);
      // onAddKey(keys[0]);

      onAddKeys(keys);

      // keys.map((key) => {
      //   //console.log(key);
      //   onAddKey(key);
      // });

      // forEach(key in keys) {
      //   onAddKey(key);
      // }
    });

    // const value = await redis.get('test');
    // console.log(value);
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
          component={Link}
          to="/"
        >
          home
        </Button>
      </div>

      <div className={classes.buttons}>
        <Button
          startIcon={<HomeIcon />}
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={(event) => connect()}
        >
          connect
        </Button>
      </div>

      <div className={classes.buttons}>
        <Button
          startIcon={<HomeIcon />}
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={(event) => onAddTest()}
        >
          add test
        </Button>
      </div>

      <KeysMemo keys={keys} onSelectKey={onSelectKey} />
    </div>
  );
}
