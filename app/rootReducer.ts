import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
import counterReducer from './features/counter/counterSlice';
import serversReducer from './features/servers/serversSlice';
import selectedReducer from './features/servers/selectedSlice';
import keysReducer from './features/keys/keysSlice';
import stringContentReducer from './features/values/stringContentSlice';
import hashContentReducer from './features/values/hashContentSlice';
import connectionReducer from './features/servers/connectionSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    counter: counterReducer,
    servers: serversReducer,
    selected: selectedReducer,
    keys: keysReducer,
    stringContent: stringContentReducer,
    hashContent: hashContentReducer,
    connections: connectionReducer,
  });
}
