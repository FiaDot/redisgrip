/**
 * 서버 정보
 */

import { createSlice } from '@reduxjs/toolkit';
const storage = require('electron-json-storage');

// 고유번호 생성용
let nextId = 2;


// redux-toolkit 이용
const serversSlice = createSlice({
  name: 'servers',
  initialState: [
  ],
  reducers: {
    addServer: (state, action) => {
      action.payload.id = action.payload.id || nextId;
      nextId += 1;
      return [...state, action.payload];
    },
    delServer: (state, action) => {
      state.filter((server) => server.id !== action.payload.id);
      return state;
    },
    editServer: (state, action) => {
      // storage.set(payload.id.toString(), payload, function(error) {
      //   if (error) throw error;
      // });

      return state.map((server) =>
        server.id === action.payload.id ? action.payload : server
      );
    },
  },
});

export const { addServer, delServer, editServer } = serversSlice.actions;
export default serversSlice.reducer;
