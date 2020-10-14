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
    // dbsize 호출해서 현재 DB의 전체 키 크기 반환
    countKey: 0,
    // 키 이름, 타입, tll 등 있어야 함!
    selectKey: null,
    selectType: null,
    // list, hash, set, zset 에서 선택한 항목
    selectSubKey: null,
    matchPattern: '*',
  },
  reducers: {
    selectServer: (state, action) => {
      return { ...state, id: action.payload };
    },
    deselectServer: (state, action) => {
      return { ...state, id: null };
    },
    selectKey: (state, action) => {
      state.selectKey = action.payload.key;
      state.selectType = action.payload.type;
      state.selectSubKey = null;
    },
    deselectKey: (state, action) => {
      state.selectKey = null;
      state.selectType = null;
      state.selectSubKey = null;
    },
    selectSubKey: (state, action) => {
      state.selectSubKey = action.payload;
    },
    deselectSubKey: (state, action) => {
      state.selectSubKey = null;
    },
    addSubKey: (state, action) => {},
    delSubKey: (state, action) => {
      state.selectSubKey = null;
    },
    editSubKey: (state, action) => {},
    setCountKey: (state, action) => {
      state.countKey = action.payload;
    },
    setMatchPattern: (state, action) => {
      console.log(`setMatchPattern=${action.payload}`);
      state.matchPattern = action.payload;
    },
  },
});

export const {
  selectServer,
  deselectServer,
  selectKey,
  deselectKey,
  selectSubKey,
  deselectSubKey,
  addSubKey,
  delSubKey,
  editSubKey,
  setCountKey,
  setMatchPattern,
} = selectedSlice.actions;
export default selectedSlice.reducer;

export const isSelectedServer = (state) => {
  return !!state.selected.id;
};
