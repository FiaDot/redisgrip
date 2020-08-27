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
      console.log(`keySlice payload=${action.payload}`);
      return state.filter((key) => key !== action.payload);
    },
  },
});

export const {
  scanKeys,
  clearKeys,
  addKey,
  addKeys,
  delKey,
} = keysSlice.actions;

export default keysSlice.reducer;
