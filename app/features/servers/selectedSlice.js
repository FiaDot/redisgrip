/**
 * 선택된 서버 아이디
 */

import { createSlice } from '@reduxjs/toolkit';

// redux-toolkit 이용
const selectedSlice = createSlice({
  name: 'selected',
  initialState: {
    id: -1,
    // checked: false,
  },
  reducers: {
    selectServer: (state, action) => {
      console.log(action);
      state.id = action.payload;
      // state.checked = !state.checked;
    },
  }
});

export const { selectServer } = selectedSlice.actions;
export default selectedSlice.reducer;
