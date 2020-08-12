import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import Redis from 'ioredis';
import { useDispatch } from 'react-redux';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/styles';
import ServersToolbar from './ServerToolbar';
import ServerList from './ServerList';
import Keys from '../keys/Keys';
import Values from '../values/Values';
import { addKeys, clearKeys } from '../keys/keysSlice';
import { connected } from './connectionSlice';
import { makeStyles } from '@material-ui/core/styles';

// const theme = createMuiTheme({
//   status: {
//     danger: orange[500],
//   },
// });

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    //backgroundColor: '#454545',
  },
}));

export default function ServerSheet() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [redis, setRedis] = useState(null);

  function connectToRedis(options) {
    // console.log(`connectToRedis=${JSON.stringify(options)}`);
    const redisInst = new Redis(options);
    return new Promise((resolve, reject) => {
      redisInst.once('error', (err) => {
        redisInst.disconnect();
        reject(err);
      });
      redisInst.once('ready', () => resolve(redisInst));
    });
  }


  const connect = async () => {
    console.log('ServerSheet:connect()');
    try {
      if (redis != null) {
        console.log('redis.disconnect()');
        redis.disconnect();
      }

      const options = {
        host: '52.79.194.253',
        port: 6379,
        password: 'asdf1234!',
        connectTimeout: 10000,
        maxRetriesPerRequest: null,
      };

      const redisInst = await connectToRedis(options);

      // TODO : INFO 요청

      const pingReply = await redisInst.ping();
      console.log(pingReply);

      if (pingReply !== 'PONG') {
        console.log('errr!!!');
      }
      setRedis(redisInst);

      const stream = await redisInst.scanStream({
        match: '*',
        count: 10000,
      });

      dispatch(clearKeys());

      stream.on('data', function (keys) {
        dispatch(addKeys(keys));
      });

      dispatch(connected(options));
      // return pingReply === 'PONG';

      const monitor = await redisInst.monitor();
      monitor.on('monitor', monitoring);

    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const monitoring = (time, args, source, database) => {
    console.log(`${time} / ${args} / ${source} / ${database}`);
    // 1597213410.710730/SSCAN,set_test,0,COUNT,10000/59.10.191.65:61924/0

  };


  return (
    // <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <ServersToolbar connect={connect} />
            <ServerList connect={connect} />
          </Grid>

          <Grid item xs={4}>
            <Keys redis={redis} />
          </Grid>

          <Grid item>
            <Values />
          </Grid>
        </Grid>
      </div>
    // </ThemeProvider>
  );
}
