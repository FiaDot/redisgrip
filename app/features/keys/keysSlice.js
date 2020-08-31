/**
  redis key
 */

import { createSlice } from '@reduxjs/toolkit';

const keysSlice = createSlice({
  name: 'keys',
  initialState: [
    /*
      {key, count, deleted}
     */
  ],
  reducers: {
    scanKeys: (state, action) => {},
    clearKeys: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state = [];
      return state;
    },
    resetKeyCount: (state, action) => {
      let item = state.find((record) => record.key === action.payload);

      if (item) {
        item.count = 0;
      }
    },
    addKeyCount: (state, action) => {
      let item = state.find((record) => record.key === action.payload.key);

      if (item) {
        item.count += 1;
      } else {
        const record = { key: action.payload.key, count: 1, deleted: false };
        state.push(record);
      }
    },
    addKey: (state, action) => {
      let item = state.find((record) => record.key === action.payload.key);

      if (item) {
        action.payload.count = item.count + 1;
        item = action.payload;
      } else {
        action.payload.count = 1;
        state.push(action.payload);
      }
    },
    addKeys: (state, action) => {
      // eslint-disable-next-line array-callback-return
      action.payload.map((item) => {
        const record = { key: item, count: 0, deleted: false };
        state.push(record);
      });
    },
    delKey: (state, action) => {
      console.log(`keySlice payload=${JSON.stringify(action.payload)}`);
      // eslint-disable-next-line no-param-reassign
      state = state.filter((record) => record.key !== action.payload.key);
      return state;
    },
    cleanupKey: (state, action) => {
      // 이미 삭제된 키
      console.log(`cleanupKey in keySlice payload=${JSON.stringify(action.payload)}`);
      // eslint-disable-next-line no-param-reassign

      let item = state.find((record) => record.key === action.payload.key);

      if (item) {
        item.deleted = true;
      }

      // state = state.filter((record) => record.key !== action.payload.key);
      // return state;
    }
  },
});

export const {
  scanKeys,
  clearKeys,
  resetKeyCount,
  addKeyCount,
  addKey,
  addKeys,
  delKey,
  cleanupKey,
} = keysSlice.actions;

export default keysSlice.reducer;
