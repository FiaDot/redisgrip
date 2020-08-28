/**
  redis key
 */

import { createSlice } from '@reduxjs/toolkit';

const keysSlice = createSlice({
  name: 'keys',
  initialState: [],
  reducers: {
    scanKeys: (state, action) => {},
    clearKeys: (state, action) => {
      state = [];
      return state;
    },
    addKey: (state, action) => {
      return [...state, action.payload];
    },
    addKeys: (state, action) => {
      return state.concat(action.payload);
    },
    delKey: (state, action) => {
      console.log(`keySlice payload=${JSON.stringify(action.payload)}`);
      // eslint-disable-next-line no-param-reassign
      state = state.filter((key) => key !== action.payload.key);
      return state;
    },
    cleanupKey: (state, action) => {
      // 이미 삭제된 키
      console.log(`cleanupKey in keySlice payload=${JSON.stringify(action.payload)}`);
      // eslint-disable-next-line no-param-reassign
      state = state.filter((key) => key !== action.payload.key);
      return state;
    }
  },
});

export const {
  scanKeys,
  clearKeys,
  addKey,
  addKeys,
  delKey,
  cleanupKey,
} = keysSlice.actions;

export default keysSlice.reducer;
