/**
 * 선택된 서버 아이디
 */

import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// redux-toolkit 이용
const selectedSlice = createSlice({
  name: 'selected',
  initialState: {
    id: '',
    // checked: false,
    // 키 이름, 타입, tll 등 있어야 함!
    selectKey: null,
  },
  reducers: {
    selectServer: (state, action) => {
      console.log(action);
      state.id = action.payload;
      // state.checked = !state.checked;
    },
    deselectServer: (state, action) => {
      console.log('called deselectServer in slice');
      state.id = null;
    },
    selectKey: (state, action) => {
      state.selectKey = action.payload;
      console.log(`called selectKey=${action.payload}`);
    },
  },
});

export const { selectServer, deselectServer, selectKey } = selectedSlice.actions;
export default selectedSlice.reducer;

export const isSelectedServer = (state) => {
  const ret = state.selected.id ? true : false;
  console.log(`isSelectedServer=${ret} id=${state.selected.id}`)
  return ret;
};
