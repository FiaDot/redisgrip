import { configureStore, getDefaultMiddleware, Action } from '@reduxjs/toolkit';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import { ThunkAction } from 'redux-thunk';
// eslint-disable-next-line import/no-cycle
import createRootReducer from './rootReducer';
import RedisMiddleware from './middleware/RedisMiddleware';

// redis instance를 redux 에 저장하기 위해 추가
const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false
});

export const history = createHashHistory();
const rootReducer = createRootReducer(history);
export type RootState = ReturnType<typeof rootReducer>;

const router = routerMiddleware(history);

//const middleware = [...getDefaultMiddleware(), router, RedisMiddleware];
const middleware = [...customizedMiddleware, router, RedisMiddleware];

const excludeLoggerEnvs = ['test', 'production'];
const shouldIncludeLogger = !excludeLoggerEnvs.includes(
  process.env.NODE_ENV || ''
);

if (shouldIncludeLogger) {
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });
  middleware.push(logger);
}

export const configuredStore = (initialState?: RootState) => {
  // Create Store
  const store = configureStore({
    reducer: rootReducer,
    middleware,
    preloadedState: initialState,
  });

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept(
      './rootReducer',
      // eslint-disable-next-line global-require
      () => store.replaceReducer(require('./rootReducer').default)
    );
  }
  return store;
};
export type Store = ReturnType<typeof configuredStore>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
