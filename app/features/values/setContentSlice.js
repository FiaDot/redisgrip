import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const setContentSlice = createSlice({
  name: 'setContent',
  initialState: {
    records: [
      // {key, values:[{no, time, table:[{value, index}]}]
    ],
  },
  reducers: {
    addSet: (state, action) => {
      const time = moment().format('YYYY-MM-DD HH:mm:ss SSS');

      const item = state.records.find(
        (record) => record.key === action.payload.key
      );

      if (item) {
        if (
          JSON.stringify(item.values[0].table) ===
          JSON.stringify(action.payload.values)
        ) {
          // console.log('eq');
          // 최근 추가한 value가 같다면 시간만 업데이트
          item.values[0].time = time;
        } else {
          // console.log('not eq');
          // 최근 추가된 정보 앞에 노출을 위해 unshift 사용
          item.values.unshift({
            no: item.values.length + 1,
            time,
            table: action.payload.values,
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
              time,
              table: action.payload.values,
            },
          ],
        });
      }
    },
  },
});

export const { addSet } = setContentSlice.actions;
export default setContentSlice.reducer;
