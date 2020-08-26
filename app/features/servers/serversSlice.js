/**
 * 서버 정보
 */
import { createSlice } from '@reduxjs/toolkit';
import uuid from 'uuid';

const storage = require('electron-json-storage');

// redux-toolkit 이용
const serversSlice = createSlice({
  name: 'servers',
  initialState: [
  ],
  reducers: {
    clearStorage: (state, action) => {
      // 저장 데이터 삭제
      storage.clear();
      // eslint-disable-next-line no-param-reassign
      state = [];
      return state;
    },
    addServer: (state, action) => {
      console.log('addServer in serverSlice');

      let item = state.find(
        (record) => record.id === action.payload.id
      );

      if (item) {
        // eslint-disable-next-line no-const-assign
        item = action.payload;
      } else {
        state.push(action.payload);
      }
    },
    delServer: (state, action) => {
      // let item = state.find(
      //   (record) => record.id === action.payload.id
      // );
      //state.remove(action.payload);
      storage.remove(action.payload);
      return state.filter((server) => server.id !== action.payload)
      //return state.filter((server) => server.id !== action.payload);
    },
    editServer: (state, action) => {
      storage.set(action.payload.id, action.payload, function(error) {
        if (error) {
          throw error;
        }
      });

      return state.map((server) =>
        server.id === action.payload.id ? action.payload : server
      );
    },
    clearServers: (state, action) => {
      // 목록만 삭제
      // eslint-disable-next-line no-param-reassign
      state = [];
    },
  },
});

export const {
  clearStorage,
  addServer,
  delServer,
  editServer,
  clearServers,
} = serversSlice.actions;

export default serversSlice.reducer;

// 저장소에서 목록 불러오기
export const loadStorage = () => {
  return (dispatch, getState) => {
    dispatch(clearServers());

    storage.getAll(function (error, data) {
      if (error) throw error;

      const keys = Object.keys(data);
      // eslint-disable-next-line array-callback-return
      keys.map((key) => {
        dispatch(addServer(data[key]));
      });
    });
  };
};

// 신규 서버 추가
export const createServer = (payload) => {
  return (dispatch, getState) => {
    // const state = getState();
    console.log(`called createServer=${JSON.stringify(payload)}`);

    payload.id = payload.id || uuid.v4();

    storage.set(payload.id, payload, function (error) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(`call dispatch(addServer) ${JSON.stringify(payload)}`);
      dispatch(addServer(payload));
    });
  };
};
