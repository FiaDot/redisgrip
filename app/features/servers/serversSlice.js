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
      return [];
    },
    addServer: (state, action) => {
      console.log('addServer in serverSlice');
      return [...state, action.payload];
    },
    delServer: (state, action) => {
      storage.remove(action.payload);
      return state.filter((server) => server.id !== action.payload);
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
      return [];
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

    storage.set(payload.id, payload, function(error) {
      if (error) throw error;

      dispatch(addServer(payload));
    });

  };
};
