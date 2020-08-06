/**
 * 서버 접속 redis instance
 */

import { createSlice } from '@reduxjs/toolkit';

// redux-toolkit 이용
const connectionSlice = createSlice({
  name: 'connections',
  initialState: [
  ],
  reducers: {
    connected: (state, action) => {
      return [...state, action.payload];
    },
    disconnected: (state, action) => {
      state.filter((server) => server.id !== action.payload.id);
      return state;
    },
  },
});

export const { connected, disconnected } = connectionSlice.actions;
export default connectionSlice.reducer;
