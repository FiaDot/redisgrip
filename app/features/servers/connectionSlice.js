/**
 * 서버 접속 redis instance
 */

import { createSlice } from '@reduxjs/toolkit';

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
    config: {},
  },
  reducers: {
    connectToServer: (state, action) => {
      state.config = action.payload;
      return state;
    },
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
  connectToServer,
  connected,
  disconnected,
  startConnecting,
  stopConnecting,
  connectSuccess,
  connectFailed,
  setShowResult,
} = connectionSlice.actions;

export default connectionSlice.reducer;

