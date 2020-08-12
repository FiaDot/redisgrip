/**
 * 선택된 서버 아이디
 */

import { createSlice } from '@reduxjs/toolkit';

// redux-toolkit 이용
const selectedSlice = createSlice({
  name: 'selected',
  initialState: {
    // 선택한 서버 id
    id: '',
    // checked: false,
    // 키 이름, 타입, tll 등 있어야 함!
    selectKey: null,
  },
  reducers: {
    selectServer: (state, action) => {
      console.log(action);
      return { ...state, id: action.payload};
    },
    deselectServer: (state, action) => {
      console.log('called deselectServer in slice');
      return { ...state, id: null};
    },
    selectKey: (state, action) => {
      console.log(`called selectKey=${action.payload}`);
      return { ...state, selectKey: action.payload};
    },
  },
});

export const { selectServer, deselectServer, selectKey } = selectedSlice.actions;
export default selectedSlice.reducer;

export const isSelectedServer = (state) => {
  return !!state.selected.id;
};
