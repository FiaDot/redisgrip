import { createSlice } from '@reduxjs/toolkit';

const stringContentSlice = createSlice({
  name: 'stringContent',
  initialState: {
    records: [],
  },
  reducers: {
    addString: (state, action) => {
      // success
      return { ...state, records: [...state.records, action.payload] };
    },
    // updateString: (state, action) => {
    //   return { ...state, content: action.payload };
    // },
    clearString: (state, action) => {
      //return { ...state, keyName: null, content: null };
    },
  },
});

export const { addString, updateString, clearString } = stringContentSlice.actions;
export default stringContentSlice.reducer;
