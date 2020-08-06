/**
 * 선택된 서버 아이디
 */

import { createSlice } from '@reduxjs/toolkit';

// redux-toolkit 이용
const selectedSlice = createSlice({
  name: 'selected',
  initialState: {
    id: null,
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
    selectKey: (state, action) => {
      state.selectKey = action.payload;
      console.log(`called selectKey=${action.payload}`);
    }
  }
});

export const { selectServer, selectKey } = selectedSlice.actions;
export default selectedSlice.reducer;
