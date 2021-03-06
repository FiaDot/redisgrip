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
    // 접속 정보
    config: {},
  },
  reducers: {
    testConnection: (state, action) => {
      state.config = action.payload;
      state.connectResult = false;
      state.connectResult = false;
      state.isConnecting = true;
    },
    connectToServer: (state, action) => {
      state.config = action.payload;
    },
    disconnected: (state, action) => {
      // state.instances.filter((server) => server.id !== action.payload.id);
      state.connectResult = false;
      state.config.id = null;
    },
    startConnecting: (state, action) => {
      state.isConnecting = true;
    },
    stopConnecting: (state, action) => {
      state.isConnecting = false;
    },
    connectSuccess: (state, action) => {
      state.isConnecting = false;
      state.connectResult = true;
    },
    connectFailed: (state, action) => {
      state.isConnecting = false;
      state.connectResult = false;
      state.config.id = null;
    },
    setShowResult: (state, action) => {
      state.showResult = action.payload;
    },
  },
});

export const {
  testConnection,
  connectToServer,
  disconnected,
  startConnecting,
  stopConnecting,
  connectSuccess,
  connectFailed,
  setShowResult,
} = connectionSlice.actions;

export default connectionSlice.reducer;
