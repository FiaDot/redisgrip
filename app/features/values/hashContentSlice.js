import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const hashContentSlice = createSlice({
  name: 'hashContent',
  initialState: {
    records: [
      // {key, values:[{no, time, hash:[{key,value}]}]
    ],
  },
  reducers: {
    addHash: (state, action) => {
      const time = moment().format('YYYY-MM-DD HH:mm:ss SSS');

      const item = state.records.find(
        (record) => record.key === action.payload.key
      );

      if (item) {
        // console.log(`old=${JSON.stringify(item.values[0].hash)}`);
        // console.log(`new=${JSON.stringify(action.payload.values)}`);

        // if ( JSON.stringify(item.values[0].hash) == JSON.stringify(action.payload.values) ) {
        //   // console.log('eq');
        //   // 최근 추가한 value가 같다면 시간만 업데이트
        //   item.values[0].time = time;
        // } else {
          // console.log('not eq');
          // 최근 추가된 정보 앞에 노출을 위해 unshift 사용
          item.values.unshift({
            no: item.values.length + 1,
            time,
            hash: action.payload.values,
          });

          // TODO : 최대 갯수 체크 할 필요 있지 않을까?
        //}
      } else {
        // 신규 키
        state.records.push({
          key: action.payload.key,
          values: [
            {
              no: 1,
              time,
              hash: action.payload.values,
            },
          ],
        });
      }
    },
  },
});

export const { addHash } = hashContentSlice.actions;
export default hashContentSlice.reducer;
