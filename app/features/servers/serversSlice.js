/**
 * 서버 정보
 */

import { createSlice } from '@reduxjs/toolkit';
import uuid from 'uuid';
const storage = require('electron-json-storage');

// redux-toolkit 이용
const serversSlice = createSlice({
  name: 'servers',
  initialState: [
  ],
  reducers: {
    addServer: (state, action) => {
      action.payload.id = action.payload.id || uuid.v4();
      console.log(`addServer id=${action.payload.id}`);
      return [...state, action.payload];
    },
    delServer: (state, action) => {
      return state.filter((server) => server.id !== action.payload);
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
