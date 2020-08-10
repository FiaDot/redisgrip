import { Client } from 'ssh2';
import Redis from 'ioredis';
import net from 'net';
import {
  connected,
  connectFailed,
  connectSuccess,
  setShowResult,
  stopConnecting,
} from '../features/servers/connectionSlice';

const RedisMiddleware = () => {
  let redis = null;

  // const onConnected = (store) => (event) => {
  //   // eslint-disable-next-line no-undef
  //   store.dispatch(actions.connected());
  // };
  //
  // const onDisconnected = store => (event) => {
  //   store.dispatch(actions.disconnect());
  // };

  function connectToSSH(options) {
    return new Promise((resolve, reject) => {
      const connection = new Client();
      connection.once('ready', () => resolve(connection));
      connection.once('error', reject);
      connection.connect(options);
    });
  }

  function connectToRedis(options) {
    console.log(`connectToRedis=${JSON.stringify(options)}`);
    const redisInst = new Redis(options);
    return new Promise((resolve, reject) => {
      redisInst.once('error', (err) => {
        redisInst.disconnect();
        reject(err);
      });
      redisInst.once('ready', () => resolve(redisInst));
    });
  }

  function createIntermediateServer(connectionListener) {
    return new Promise((resolve, reject) => {
      const server = net.createServer(connectionListener);
      server.once('error', reject);
      server.listen(0, () => resolve(server));
    });
  }

  async function connectToRedisViaSSH(
    options = {
      ssh: {
        host: 'localhost',
        port: 22,
      },
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }
  ) {
    console.log(
      `called connectToRedisViaSSH options=${JSON.stringify(options)}`
    );

    if (!options.ssh) {
      console.log('direct access connectToRedis');

      const redisInst = await connectToRedis({
        host: options.redis.host,
        port: options.redis.port,
        password: options.redis.password,
        connectTimeout: 10000,
        maxRetriesPerRequest: null,
      });
      return redisInst;
    }
    const sshConnection = await connectToSSH({
      host: options.ssh.host,
      port: options.ssh.port,
      username: options.ssh.username,
      privateKey: options.ssh.privateKey,
      passphrase: options.ssh.passphrase,
    });

    const server = await createIntermediateServer((socket) => {
      sshConnection.forwardOut(
        socket.remoteAddress,
        socket.remotePort,
        options.redis.host,
        options.redis.port,
        (error, stream) => {
          if (error) {
            socket.end();
          } else {
            socket.pipe(stream).pipe(socket);
          }
        }
      );
    });

    const redisInst = await connectToRedis({
      host: server.address().address,
      port: server.address().port,
      password: options.redis.password,
      connectTimeout: 10000,
      maxRetriesPerRequest: 0,
    });

    return redisInst;
  }

  const connect = async (config) => {
    console.log(`called connect and ping function`);

    try {
      if (redis != null) {
        redis.close();
      }

      redis = await connectToRedisViaSSH({
        // ssh: {
        //   host: null,
        //   port: null,
        //   username: null,
        //   privateKey: null,
        //   passphrase: null,
        // },
        redis: {
          host: '52.79.194.253',
          port: 6379,
          password: 'asdf1234!',
        },
      });

      const pingReply = await redis.ping();
      return pingReply === 'PONG';
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return (store) => (next) => (action) => {
    console.log(
      `RedisMiddleware type=${action.type} payload=${JSON.stringify(
        action.payload
      )}`
    );

    switch (action.type) {
      case 'connections/connectToServer':
        const result = connect(action.payload).then((ret) => {
          store.dispatch(stopConnecting());
          if (ret) {
            store.dispatch(connectSuccess());
          } else {
            store.dispatch(connectFailed());
          }
          store.dispatch(setShowResult(true));
        });
        // if ( null != redis ) {
        //   redis.close();
        // }
        //
        // redis = new Redis(action.payload);
        // return new Promise((resolve, reject) => {
        //   redis.once('error', (err) => {
        //     redis.disconnect();
        //     reject(err);
        //   });
        //   redis.once('ready', () => resolve(redis));
        // });
        break;
      default:
        next(action);
    }
  };
};

export default RedisMiddleware();
