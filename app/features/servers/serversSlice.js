/**
 * 서버 정보
 */

import { createSlice } from '@reduxjs/toolkit';

// 고유번호 생성용
let nextId = 2;

// redux-toolkit 이용
const serversSlice = createSlice({
  name: 'servers',
  initialState: [
    { id: 1, name: 'local', host: 'localhost', port: 6379, pwd: '' },
  ],
  reducers: {
    addServer: (state, { payload }) => {
      payload.id = nextId;
      nextId += 1;
      return [...state, payload];
    },
    delServer: (state, action) => {
      state.filter((server) => server.id !== action.payload);
      return state;
    },
    editServer: (state, { payload }) => {
      return state.map((server) =>
        server.id === payload.id ? { ...server, payload } : server
      );
    },
  },
});

export const { addServer, delServer, editServer } = serversSlice.actions;
export default serversSlice.reducer;
