import { createSlice } from '@reduxjs/toolkit';

const popupSlice = createSlice({
  name: 'popup',
  initialState: {
    message: null,
    // serverity: 'error',
    isOpenPopup: false,
  },
  reducers: {
    showPopup: (state, action) => {
      state.message = action.payload.message;
      // state.serverity = action.payload.serverity;
      state.isOpenPopup = true;
    },
    hidePopup: (state, action) => {
      state.message = null;
      state.isOpenPopup = false;
    },
  },
});

export const { showPopup, hidePopup } = popupSlice.actions;

export default popupSlice.reducer;
