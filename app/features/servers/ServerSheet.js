import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import ServersToolbar from './ServerToolbar';
import ServerList from './ServerList';
import Keys from '../keys/Keys';
import Values from '../values/Values';
import { Client } from 'ssh2';
import Redis from 'ioredis';
import net from 'net';
import { addKeys, clearKeys } from '../keys/keysSlice';
import { useDispatch } from 'react-redux';

export default function ServerSheet() {
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

      if ( pingReply !== 'PONG' ) {
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
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const onMonitor = async () => {
    // const monitor = await redis.monitor();
    // monitor.on('monitor', console.log);
  };

  //
  // const stream = await redis.scanStream({
  //     match: '*',
  //     count: 10000,
  //   });
  //
  //   // stream.on('data', function (keys) {
  //   //   onAddKeys(keys);
  //   // });
  //
  //   // const monitor = await redis.monitor();
  //   // monitor.on('monitor', console.log);
  // };

  return (
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
  );
};
