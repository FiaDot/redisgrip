import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const stringContentSlice = createSlice({
  name: 'stringContent',
  initialState: {
    records: [],
  },
  reducers: {
    addString: (state, action) => {
      const time = moment().format('YYYY-MM-DD HH:mm:ss SSS');

      const item = state.records.find(
        (record) => record.key === action.payload.key
      );

      if (item) {
        // 기존에 키 있
        if ( item.values[0].value === action.payload.value ) {
          // 최근 추가한 value가 같다면 시간만 업데이트
          item.values[0].time = time;
        } else {
          // 최근 추가된 정보 앞에 노출을 위해 unshift 사용
          item.values.unshift({
            no: item.values.length + 1,
            value: action.payload.value,
            time,
          });
          // TODO : 최대 갯수 체크 할 필요 있지 않을까?
        }
      } else {
        // 신규 키
        state.records.push({
          key: action.payload.key,
          values: [
            {
              no: 1,
              value: action.payload.value,
              time,
            },
          ],
        });
      }
    },
    clearString: (state, action) => {
      state.records = state.records.filter((record) => record.key !== action.payload);
    },
    clearAllString: (state, action) => {
      state.records = [];
    },
  },
});

export const { addString, clearString, clearAllString } = stringContentSlice.actions;
export default stringContentSlice.reducer;
