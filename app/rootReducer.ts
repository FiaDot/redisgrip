import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
import counterReducer from './features/counter/counterSlice';
import serversReducer from './features/servers/serversSlice';
import selectedReducer from './features/servers/selectedSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    counter: counterReducer,
    servers: serversReducer,
    selected: selectedReducer,
  });
}
