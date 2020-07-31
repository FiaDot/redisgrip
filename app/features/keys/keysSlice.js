/**
  redis key
 */

import { createSlice } from '@reduxjs/toolkit';

const keysSlice = createSlice({
  name: 'keys',
  initialState: [],
  reducers: {
    addKey: (state, action) => {
      return [...state, action.payload];
    },
    addKeys: (state, action) => {
      return state.concat(action.payload);
    },
    delKey: (state, action) => {
      state.filter((server) => server !== action.payload);
      return state;
    },
  },
});

export const { addKey, addKeys, delKey } = keysSlice.actions;
export default keysSlice.reducer;
