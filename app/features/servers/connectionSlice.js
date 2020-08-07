/**
 * 서버 접속 redis instance
 */

import { createSlice } from '@reduxjs/toolkit';
import { Client } from 'ssh2';
import Redis from 'ioredis';
import net from 'net';

function connectToSSH(options) {
  return new Promise((resolve, reject) => {
    const connection = new Client();
    connection.once('ready', () => resolve(connection));
    connection.once('error', reject);
    connection.connect(options);
  });
}

function connectToRedis(options) {
  // console.log(`connectToRedis=${JSON.stringify(options)}`);
  const redisInst = new Redis(options);
  return new Promise((resolve, reject) => {
    redisInst.once('error', reject);
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
  console.log(`called connectToRedisViaSSH options=${JSON.stringify(options)}`);

  if (!options.ssh) {
    const redisInst = await connectToRedis({
      host: options.redis.host,
      port: options.redis.port,
      password: options.redis.password,
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
  });

  return redisInst;
}

const connect = async () => {
  console.log(`called connect and ping function`);

  try {
    const redis = await connectToRedisViaSSH({
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
    return 'PONG' === pingReply;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const connectionSlice = createSlice({
  name: 'connections',
  initialState: {
    // 결과 보여줘야 하나?
    showResult: false,
    // 접속 성공 여부
    connectResult: false,
    // 접속 시도중 인가?
    isConnecting: false,
    // 접속된 redis instance들
    instances: [],
  },
  reducers: {
    connected: (state, action) => {
      [...state.instances, action.payload];
      return state;
    },
    disconnected: (state, action) => {
      state.instances.filter((server) => server.id !== action.payload.id);
      return state;
    },
    startConnecting: (state, action) => {
      state.isConnecting = true;
    },
    stopConnecting: (state, action) => {
      state.isConnecting = false;
    },
    connectSuccess: (state, action) => {
      console.log('called connectSuccess');
      state.connectResult = true;
    },
    connectFailed: (state, action) => {
      console.log('called connectFailed');
      state.connectResult = false;
    },
    setShowResult: (state, action) => {
      state.showResult = action.payload;
      return state;
    },
  },
});

export const {
  connected,
  disconnected,
  startConnecting,
  stopConnecting,
  connectSuccess,
  connectFailed,
  setShowResult,
} = connectionSlice.actions;

export default connectionSlice.reducer;

// async 형태
export const connectToServer = (connectionInfo) => {
  return (dispatch, getState) => {
    // const state = getState();
    console.log(`called connectToServer in connectionSlice=${JSON.stringify(connectionInfo)}`);
    dispatch(startConnecting());

    // 강제 지연
    setTimeout(function() {
      const result = connect()
        .then((ret) => {
          dispatch(stopConnecting());
          if (ret) {
            dispatch(connectSuccess());
          } else {
            dispatch(connectFailed());
          }
          dispatch(setShowResult(true));
        })
        .catch((err) => {
          console.log('catch!!');
          dispatch(stopConnecting());
          dispatch(connectFailed());
          dispatch(setShowResult(true));
        });
    }, 3000);
  };
};
