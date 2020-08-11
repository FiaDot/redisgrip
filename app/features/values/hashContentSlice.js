import { createSlice } from '@reduxjs/toolkit';

const hashContentSlice = createSlice({
  name: 'hashContent',
  initialState: {
    keyName: null,
    contents: [
      {key: 'k1', value:'v1'},
      {key: 'k2', value:'v2'},
    ],
    // ttl: -1,
  },
  reducers: {
    addHash: (state, action) => {
      state.keyName = action.payload.keyName;
      state.contents = action.payload.contents;
      return state;
    },
  },
});

export const { addHash } = hashContentSlice.actions;
export default hashContentSlice.reducer;
