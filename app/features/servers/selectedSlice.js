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
    selectType: null,
  },
  reducers: {
    selectServer: (state, action) => {
      return { ...state, id: action.payload};
    },
    deselectServer: (state, action) => {
      return { ...state, id: null};
    },
    selectKey: (state, action) => {
      state.selectKey = action.payload.key;
      state.selectType = action.payload.type;
    },
    deselectKey: (state, action) => {
      state.selectKey = null;
      state.selectType = null;
    }
  },
});

export const { selectServer, deselectServer, selectKey, deselectKey } = selectedSlice.actions;
export default selectedSlice.reducer;

export const isSelectedServer = (state) => {
  return !!state.selected.id;
};
