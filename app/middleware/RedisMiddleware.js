import { Client } from 'ssh2';
import Redis from 'ioredis';
import net from 'net';
import moment from 'moment';
import fs from 'fs';
import {
  connectFailed,
  connectSuccess,
  setShowResult,
  startConnecting,
  stopConnecting,
} from '../features/servers/connectionSlice';
import {
  addKeyCount,
  addKeys,
  cleanupKey,
  clearKeys,
  delKey,
  resetKeyCount,
} from '../features/keys/keysSlice';
import { addString } from '../features/values/stringContentSlice';
import { deselectKey, selectKey } from '../features/servers/selectedSlice';
import { addZset } from '../features/values/zsetContentSlice';
import { addList } from '../features/values/listContentSlice';
import { addSet } from '../features/values/setContentSlice';
import { addHash } from '../features/values/hashContentSlice';

const RedisMiddleware = () => {
  let redis = null;
  const connectionOptions = {
    host: '52.79.194.253',
    port: 6379,
    password: 'asdf1234!',
    connectTimeout: 10000,
    maxRetriesPerRequest: null,
  };

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

    if (!options.sshActive) {
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

    console.log('ssh access connectToRedis');
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

  const makeKeyValueFromHash = async (raw) => {
    const kv = [];

    for (let n = 0; n < raw.length / 2; n += 1) {
      kv.push({ key: raw[n * 2], value: raw[n * 2 + 1] });
    }
    return kv;
  };

  const makeValuePairArray = async (raw) => {
    return raw.map((value, index) => {
      return { value, index };
    });
  };

  return (store) => (next) => async (action) => {
    const reduceRedisOp = (args) => {
      console.log(`reduceRedisOp ${args}`);
      // 모니터링 에서 받은 op중 update와 관련된 모든 항목을 타입에 맞게 redux에 저장

      const op = args.split(',');

      switch (op[0]) {
        case 'SET': // string
          // op[1] // key
          // op[2] // value
          store.dispatch(addString({ key: op[1], value: op[2] }));
          break;

        case 'DEL': // string
          store.dispatch(cleanupKey({ key: op[1] }));
          return;

        case 'HSETNX': // hash value add
          break;
        case 'HSET': // hash value edit
          break;
        case 'HDEL': // hash value del
          break;

        case 'LPUSH': // list add value
          break;
        case 'LREM': // list del value
          break;

        case 'ZADD': // zset add value
          break;
        case 'ZREM': // zrem del value
          break;

        case 'SADD': // set add
          break;
        case 'SREM': // set value del
          break;

        default:
          return;
      }

      store.dispatch(addKeyCount({ key: op[1] }));
    };

    const parseMonitorLog = (time, args, source, database) => {
      const fmtTime = moment
        .unix(time)
        .format('YYYY-MM-DD HH:mm:ss:SSS')
        .toString();
      // console.log(`${fmtTime} / ${args} / ${source} / ${database}`);
      // 1597213410.710730/SSCAN,set_test,0,COUNT,10000/59.10.191.65:61924/0
      reduceRedisOp(args.toString());
    };

    const onError = (event) => {
      console.log(`RedisMiddleware onError= ${event}`);
    };

    const connect = async (config) => {
      try {
        if (redis != null) {
          redis.disconnect();
        }

        let privateKey = null;

        if (config.pemFilePath) {
          privateKey = fs.readFileSync(config.pemFilePath);
        }

        const options = {
          sshActive: config.sshActive,
          ssh: {
            host: config.sshHost,
            port: config.sshPort,
            username: config.sshUsername,
            privateKey,
            passphrase: config.pemPassphrase,
          },
          redis: {
            host: config.host,
            port: config.port,
            password: config.password,
            connectTimeout: 10000,
            maxRetriesPerRequest: null,
          },
        };

        redis = await connectToRedisViaSSH(options);
        redis.error = onError();

        const pingReply = await redis.ping();
        if (pingReply !== 'PONG') {
          console.log('ping error');
          return false;
        }
        console.log('pong ok');
        return true;
      } catch (err) {
        console.log(err);
        // throw err;
        return false;
      }
    };

    const monitoring = async () => {
      const monitor = await redis.monitor();
      monitor.on('monitor', parseMonitorLog);
    };

    const addKey = async (key, type) => {
      console.log(`addKey ${key} as ${type}`);

      let ret;

      switch (type) {
        case 'string':
          ret = await redis.set(key, 'tmp');
          break;
        case 'list':
          ret = await redis.lpush(key, 'tmp');
          break;
        case 'hash':
          ret = await redis.hset(key, 'tmp_key', 'tmp_value');
          break;
        case 'set':
          ret = await redis.sadd(key, 'tmp');
          break;
        case 'zset':
          ret = await redis.zadd(key, 0, 'tmp');
          break;
        default:
          console.log('wrong type');
          return false;
      }

      if (ret > 0 || ret == 'OK') {
        return true;
      }

      return false;
    };

    const onResetKeyCount = async (key) => {
      store.dispatch(resetKeyCount(key));
    };

    const selectKeyAndAdd = async (key) => {
      const type = await redis.type(key);
      // console.log(`called onSelectKey ${key}=${type}`);

      switch (type) {
        case 'string': {
          const value = await redis.get(key);
          console.log(`called selectKeyAndAdd ${key}=${value}`);
          store.dispatch(addString({ key, value }));
          break;
        }
        case 'zset': {
          const count = await redis.zcard(key);
          console.log(`called selectKeyAndAdd ${key}=${count}`);
          const data = await redis.zrange(key, 0, count, 'WITHSCORES');
          console.log(`zset len=${data.length},data=${data} `);

          const kv = await makeKeyValueFromHash(data);
          console.log(kv);
          store.dispatch(addZset({ key, values: kv }));
          break;
        }
        case 'list': {
          const len = await redis.llen(key);
          const data = await redis.lrange(key, 0, len);
          console.log(`called selectKeyAndAdd ${key}=${data}`);
          store.dispatch(
            addList({ key, values: await makeValuePairArray(data) })
          );
          break;
        }
        case 'set': {
          const len = await redis.scard(key);
          const data = await redis.sscan(key, 0, 'count', 10000);
          console.log(`called selectKeyAndAdd ${key}=${data}`);
          store.dispatch(
            addSet({ key, values: await makeValuePairArray(data[1]) })
          );
          break;
        }
        case 'hash': {
          const len = await redis.hlen(key);
          const data = await redis.hscan(key, 0, 'COUNT', 10000);
          console.log(`called selectKeyAndAdd ${key}=${data}`);
          const kv = await makeKeyValueFromHash(data[1]);
          // console.log(kv);
          store.dispatch(addHash({ key, values: kv }));
          break;
        }
        default:
          console.log('selectKeyAndAdd not matched type');
          return null;
      }

      return type;
    };

    const scanKeys = async () => {
      const stream = await redis.scanStream({
        match: '*',
        count: 10000,
      });

      store.dispatch(clearKeys());

      stream.on('data', function (keys) {
        store.dispatch(addKeys(keys));
      });
    };

    const onDelKey = async (key) => {
      const ret = await redis.del(key);
      console.log(`RedisMiddleWare onDelKey key=${key}, ret=${ret}`);

      if (ret > 0 || ret == 'OK') {
        return true;
      }
      return false;
    };

    const addSubKey = async (mainKey, type, key, val) => {
      // console.log(`addSubKey ${type} / ${key} / ${val}`);
      let ret = 'OK';

      switch (type) {
        case 'string':
          ret = await redis.set(mainKey, val);
          break;
        case 'list':
          ret = await redis.lpush(mainKey, val);
          break;
        case 'hash':
          ret = await redis.hset(mainKey, key, val);
          break;
        case 'set':
          ret = await redis.sadd(mainKey, val);
          break;
        case 'zset':
          ret = await redis.zadd(mainKey, val, key);
          break;
        default:
          console.log('type is wrong');
          return;
      }

      if (ret > 0 || ret == 'OK') {
        return true;
      }

      return false;
    };

    const delSubKey = async (mainKey, type, key) => {
      console.log(`onDeleteSubKey ${mainKey} ${type} ${key}`);

      let ret = 'OK';

      switch (type) {
        // case 'string':
        //   ret = await redis.set(selectKey, val);
        //   break;
        case 'list':
          // ret = await redis.lremindex(mainKey, key);
          await redis.lset(mainKey, key, 'deleted');
          await redis.lrem(mainKey, 1, 'deleted');
          break;
        case 'hash':
          ret = await redis.hdel(mainKey, key);
          break;
        case 'set':
          ret = await redis.srem(mainKey, key);
          break;
        case 'zset':
          ret = await redis.zrem(mainKey, key);
          break;
        default:
          console.log('type is wrong');
          return;
      }

      if (ret > 0 || ret == 'OK') return true;

      return false;
    };

    const editSubKey = async (mainKey, type, key, val) => {
      console.log(`editSubKey ${mainKey} / ${type} / ${key} / ${val}`);
      let ret = 'FAILED';

      switch (type) {
        case 'string':
          ret = await redis.set(mainKey, val);
          break;

        case 'list':
          ret = await redis.lset(mainKey, key, val);
          break;

        case 'hash':
          ret = await redis.hset(mainKey, key, val);
          break;

        case 'set':
          ret = await redis.srem(mainKey, key);
          ret = await redis.sadd(mainKey, val);
          break;

        case 'zset':
          ret = await redis.zrem(mainKey, key);
          ret = await redis.zadd(mainKey, val, key);
          break;

        default:
          console.log('type is wrong');
          return;
      }

      if (ret > 0 || ret == 'OK') {
        return true;
      }

      return false;
    };

    console.log(`RedisMiddleware type=${action.type}`);
    let isSuccess;

    if (redis != null) {
      try {
        const alive = await redis.ping();
      } catch (err) {
        await connect(connectionOptions);
      }
    }

    switch (action.type) {
      case 'connections/connectToServer':
        next(action);

        isSuccess = await connect(action.payload);

        if (isSuccess) {
          await scanKeys();
          await monitoring();
          await store.dispatch(connectSuccess());
        } else {
          await store.dispatch(connectFailed());
        }

        await store.dispatch(setShowResult(true));
        break;

      case 'connections/testConnection':
        // await store.dispatch(startConnecting());
        next(action);

        isSuccess = await connect(action.payload);

        if (isSuccess) {
          await store.dispatch(connectSuccess());
        } else {
          await store.dispatch(connectFailed());
        }

        await store.dispatch(setShowResult(true));
        return isSuccess;

      case 'connections/disconnected':
        redis.disconnect();
        next(action);
        break;

      case 'keys/addKey':
        isSuccess = await addKey(action.payload.key, action.payload.type);

        if (isSuccess) {
          await selectKeyAndAdd(action.payload.key);
          await store.dispatch(selectKey({ key: action.payload.key }));
        }

        next(action);
        return isSuccess;

      case 'keys/scanKeys':
        await scanKeys();
        break;

      case 'keys/delKey':
        isSuccess = await onDelKey(action.payload.key);
        next(action);
        return isSuccess;

      case 'selected/selectKey':
        await onResetKeyCount(action.payload.key);

        // eslint-disable-next-line no-case-declarations
        const type = await selectKeyAndAdd(action.payload.key);
        action.payload.type = type;

        next(action);
        return type;

      case 'selected/addSubKey':
        isSuccess = await addSubKey(
          action.payload.mainKey,
          action.payload.type,
          action.payload.key,
          action.payload.val
        );
        await selectKeyAndAdd(action.payload.mainKey);
        return isSuccess;

      case 'selected/delSubKey':
        isSuccess = await delSubKey(
          action.payload.mainKey,
          action.payload.type,
          action.payload.key
        );

        await selectKeyAndAdd(action.payload.mainKey);
        // if (null == (await selectKeyAndAdd(action.payload.mainKey))) {
        //   await store.dispatch(delKey(action.payload.mainKey));
        //   await store.dispatch(deselectKey());
        // }
        return isSuccess;

      case 'selected/editSubKey':
        isSuccess = await editSubKey(
          action.payload.mainKey,
          action.payload.type,
          action.payload.key,
          action.payload.val
        );
        await selectKeyAndAdd(action.payload.mainKey);
        return isSuccess;

      default:
        next(action);
    }
  };
};

export default RedisMiddleware();
