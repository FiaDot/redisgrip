import { createSlice } from '@reduxjs/toolkit';

const hashContentSlice = createSlice({
  name: 'hashContent',
  initialState: {
    keyName: null,
    content: [],
    // ttl: -1,
  },
  reducers: {
    addHash: (state, action) => {
      state.keyName = action.payload.keyName;
      state.content = action.payload.content;
      return state;
    },
  },
});

export const { addHash } = hashContentSlice.actions;
export default hashContentSlice.reducer;
