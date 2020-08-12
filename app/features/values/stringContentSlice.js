import { createSlice } from '@reduxjs/toolkit';

const stringContentSlice = createSlice({
  name: 'stringContent',
  initialState: {
    keyName: 'test_key',
    content: 'test_value',
    // ttl: -1,
  },
  reducers: {
    addString: (state, action) => {
      return { ...state, keyName: action.payload.keyName, content: action.payload.content };
    },
    updateString: (state, action) => {
      return { ...state, content: action.payload };
    },
    clearString: (state, action) => {
      return { ...state, keyName: null, content: null };
    }
  },
});

export const { addString, updateString, clearString } = stringContentSlice.actions;
export default stringContentSlice.reducer;
