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

import moment from 'moment';
import { addString } from '../values/stringContentSlice';
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


  const reduceRedisOp = async (args) => {
    // 모니터링 에서 받은 op중 update와 관련된 모든 항목을 타입에 맞게 redux에 저장

    const op = args.split(',');

    switch (op[0]) {
      case 'SET':
        // op[1] // key
        // op[2] // value
        dispatch(addString({ key: op[1], value: op[2] }));
        break;
      default:
        break;
    }
  };

  const monitoring = (time, args, source, database) => {
    const fmtTime = moment.unix(time).format('YYYY-MM-DD HH:mm:ss:SSS').toString();
    console.log(`${fmtTime} / ${args} / ${source} / ${database}`);
    // 1597213410.710730/SSCAN,set_test,0,COUNT,10000/59.10.191.65:61924/0

    reduceRedisOp(args.toString());
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
