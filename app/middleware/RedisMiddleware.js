import { Client } from 'ssh2';
import Redis from 'ioredis';
import net from 'net';
import moment from 'moment';
import fs from 'fs';
import {
  connectFailed,
  connectSuccess, disconnected,
  setShowResult,
  startConnecting,
  stopConnecting
} from '../features/servers/connectionSlice';
import {
  addKeyCount,
  addKeys,
  cleanupKey,
  clearKeys,
  delKey,
  resetKeyCount, scanKeys
} from '../features/keys/keysSlice';
import { addString } from '../features/values/stringContentSlice';
import {
  deselectKey, hideWaiting,
  selectKey,
  setCountKey,
  setMatchPattern,
  setProgress,
  showPopup, showWaiting
} from '../features/servers/selectedSlice';
import { addZset } from '../features/values/zsetContentSlice';
import { addList } from '../features/values/listContentSlice';
import { addSet } from '../features/values/setContentSlice';
import { addHash } from '../features/values/hashContentSlice';
var readline = require('readline');
const {dialog} = require('electron').remote;


const RedisMiddleware = () => {
  let redis = null;
  let monitor = null;

  const timeout = 5000;

  let connectionOptions = {
    host: '127.0.0.1',
    port: 6379,
    connectTimeout: timeout,
    maxRetriesPerRequest: 0,
    retryStrategy: null,
  };

  function connectToSSH(options) {
    options.readyTimeout = timeout;

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
        maxRetriesPerRequest: 0,
        retryStrategy: null,
        connectTimeout: timeout,
      },
      redis: {
        host: 'localhost',
        port: 6379,
        maxRetriesPerRequest: 0,
        retryStrategy: null,
        connectTimeout: timeout,
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
        connectTimeout: timeout,
        maxRetriesPerRequest: 0,
        retryStrategy: null,
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
      connectTimeout: timeout,
      maxRetriesPerRequest: 0,
      retryStrategy: null,
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
      connectTimeout: timeout,
      maxRetriesPerRequest: 0,
      retryStrategy: null,
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
      //console.log(`reduceRedisOp ${args}`);
      // 모니터링 에서 받은 op중 update와 관련된 모든 항목을 타입에 맞게 redux에 저장

      const op = args.split(',');

      switch (op[0].toUpperCase()) {
        case 'SET': // string
          // op[1] // key
          // op[2] // value
          store.dispatch(addString({ key: op[1], value: op[2] }));
          break;

        case 'DEL': // string
          console.log(`reduceRedisOp ${args}`);
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

      // console.log(`reduceRedisOp ${args}`);
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
        // console.trace("Here I am!");

        if (redis != null) {
          console.log('!!! connect remove listener');

          if ( monitor != null ) {
            monitor.removeAllListeners();
            monitor.removeListener('monitor', parseMonitorLog);
          }

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
            maxRetriesPerRequest: 0,
            retryStrategy: null,
          },
          redis: {
            host: config.host,
            port: config.port,
            password: config.password,
            connectTimeout: 3000,
            maxRetriesPerRequest: 0,
            retryStrategy: null,
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
      monitor = await redis.monitor();
      monitor.on('monitor', parseMonitorLog);
    };

    const monitoringOff = async () => {
      try {
        if ( null == redis )
        {
          console.log('monitoringOff #2');
          return;
        }

        // const monitor = await redis.monitor();

        if ( null == monitor )
        {
          console.log('monitoringOff #3');
          return;
        }

        console.log('monitoringOff #1');

        monitor.removeAllListeners();
        monitor.removeListener('monitor', parseMonitorLog);

        monitor = null;
        // monitor.off('monitor');
      } catch (err) {
        console.log(err);
      }
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

    const countKey = async () => {
      const count = await redis.dbsize();
      console.log(`count=${count}`);
      store.dispatch(setCountKey(count));
    };

    const scanKeys = async (match='*') => {
      await countKey();

      console.log(`scanKeys match=${match}`);

      store.dispatch(setMatchPattern(match));

      const stream = await redis.scanStream({
        match,
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

    function numHex(s)
    {
      var a = s.toString(16);
      if ((a.length % 2) > 0) {
        a = '0' + a;
      }
      return '0x' + a;
    }

    const onExportKeys = async (filename, match) => {
      console.log(`RedisMiddleWare onExportKeys ${filename}`);

      const stream = await redis.scanStream({
        match,
        count: 10000,
      });

      // let lines = [];

      fs.open(filename, 'w', async (err, fd) => {

        stream.on('data', async function (keys) {
          store.dispatch(showWaiting());

          const promises = keys.map(async (key) => {
            const data = await redis.dumpBuffer(key);
            const value = Buffer.from(data, 'binary').toString('base64');
            const kv = { key, value };
            // lines.push(JSON.stringify(kv) + '\n');

            fs.appendFile(fd, JSON.stringify(kv) + '\n', (err) => {
              if ( err )
                console.log(err);
            });
          });

          await Promise.all(promises);
          // store.dispatch(setProgress({ isProgress: false, progress: 100 }));
          // console.log(lines);

          fs.close(fd, function() {
            store.dispatch(hideWaiting());

            store.dispatch(
              showPopup({
                popupMessage: 'export succeeded',
                popupSeverity: 'success',
              })
            );

            console.log('[modified] wrote the file successfully');
          });
        });
      });
    };


    const onImportKeys = async (filename) => {
      console.log(`RedisMiddleWare onImportKeys ${filename}`);

      var instream = fs.createReadStream(filename);
      var reader = readline.createInterface(instream);

      var count = 0;

      let key = '';
      let value = '';

      store.dispatch(showWaiting());

      // 한 줄씩 읽어들인 후에 발생하는 이벤트
      reader.on('line', async function(line) {
        count += 1;

        const kv = JSON.parse(line);
        key = kv.key;
        value = Buffer.from(kv.value, 'base64');

        try {
          await redis.restore(key, 0, value);
        } catch (err) {
          console.log(`err=${err}`);

          store.dispatch(hideWaiting());

          store.dispatch(
            showPopup({
              popupMessage: `import error=${err}`,
              popupSeverity: 'error',
          }));
        }
      });

      // 모두 읽어들였을 때 발생하는 이벤트
      reader.on('close', function(line) {
        console.log(`read done count=${count}`);

        store.dispatch(hideWaiting());

        store.dispatch(
          showPopup({
            popupMessage: 'import succeeded',
            popupSeverity: 'success',
          })
        );

        store.dispatch(scanKeys());
      });
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

    // console.log(`RedisMiddleware type=${action.type}`);

    switch (action.type) {
      case 'connections/connectToServer':
      case 'connections/testConnection':
      case 'connections/disconnected':
        break;

      default:
        if (redis != null) {
          try {
            const alive = await redis.ping();
          } catch (err) {
            console.log(err);
            // TODO : 접속 종료 처리
            await monitoringOff();
            redis.disconnect();
            redis = null;
            // redis = null;

            next(action);

            await store.dispatch(deselectKey());
            await store.dispatch(clearKeys());
            await store.dispatch(connectFailed());

            await dialog.showErrorBox('ERROR', 'Connection lost.');
            return;
          }
        }
    }


    let isSuccess;

    switch (action.type) {
      case 'connections/connectToServer':
        next(action);

        await monitoringOff();
        isSuccess = await connect(action.payload);

        if (isSuccess) {
          connectionOptions = action.payload;
          await scanKeys();
          await monitoring();
          await store.dispatch(connectSuccess());
        } else {
          await store.dispatch(connectFailed());
        }

        await store.dispatch(setShowResult(true));
        return;

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
        await store.dispatch(stopConnecting());
        await store.dispatch(setShowResult(false));
        await monitoringOff();
        redis.disconnect();
        redis = null;
        next(action);
        return;

      case 'keys/addKey':
        isSuccess = await addKey(action.payload.key, action.payload.type);

        if (isSuccess) {
          await selectKeyAndAdd(action.payload.key);
          await store.dispatch(selectKey({ key: action.payload.key }));
        }

        await countKey();
        next(action);
        return isSuccess;

      case 'keys/scanKeys':
        await scanKeys(action.payload);
        break;

      case 'keys/delKey':
        isSuccess = await onDelKey(action.payload.key);
        await countKey();
        next(action);
        return isSuccess;

      case 'keys/exportKeys':
        await onExportKeys(action.payload.filename, action.payload.match);
        break;

      case 'keys/importKeys':
        await onImportKeys(action.payload.filename);
        break;

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
