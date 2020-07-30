import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk, RootState } from '../../store';
import ioredis from 'ioredis';

const connect_and_ping = async () => {
  console.log(`called connect and ping function`);

  const testHost = 'df-bforce-lgh.clafgames.com';

  const redis = new ioredis({
    port: 6379, // Redis port
    host: testHost, // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: 'asdf1234!',
    db: 0
  });

  redis.ping((err, res) => {
    if ( err ) {
      console.log('err');
      console.log(err.message);
    }
    else {
      console.log('success');
    }
  })
  // const value = await redis.get('test');
  // console.log(value);
};


const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
      connect_and_ping();
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

export const incrementIfOdd = (): AppThunk => {
  return (dispatch, getState) => {
    const state = getState();
    if (state.counter.value % 2 === 0) {
      return;
    }
    dispatch(increment());
  };
};

export const incrementAsync = (delay = 1000): AppThunk => (dispatch) => {
  setTimeout(() => {
    dispatch(increment());
  }, delay);
};

export default counterSlice.reducer;

export const selectCount = (state: RootState) => state.counter.value;
