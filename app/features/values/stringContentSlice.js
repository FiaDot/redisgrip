import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const stringContentSlice = createSlice({
  name: 'stringContent',
  initialState: {
    records: [],
  },
  reducers: {
    addString: (state, action) => {
      // success
      //return { ...state, records: [...state.records, action.payload] };

      // success
      // console.log('state.records.push');
      // state.records.push(action.payload);

      // success
      console.log('add in add');
      const item = state.records.find((record) => record.key === action.payload.key);
      if (item) {
        // 최근 추가된 정보 앞에 노출을 위해 unshift 사용
        item.values.unshift({
          no : item.values.length + 1,
          value: action.payload.value,
          time: moment().format('YYYY-MM-DD HH:mm:ss SSS'),
        });
      } else {
        state.records.push({
          key: action.payload.key,
          values: [{
            no: 1,
            value: action.payload.value,
            time: moment().format('YYYY-MM-DD HH:mm:ss SSS'),
          }],
        });
      }
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
