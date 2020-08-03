import { createSlice } from '@reduxjs/toolkit';

const stringContentSlice = createSlice({
  name: 'stringContent',
  initialState: {
    keyName: null,
    // content: null,
    // ttl: -1,
  },
  reducers: {
    addString: (state, action) => {
      state.keyName = action.payload.keyName;
      return state;
    },
    updateString: (state, action) => {
      return [...state, action.payload];
    },
  },
});

export const { addString, updateString } = stringContentSlice.actions;
export default stringContentSlice.reducer;
