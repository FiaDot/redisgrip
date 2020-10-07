/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';

// Lazily load routes and code split with webpacck
const LazyCounterPage = React.lazy(() =>
  import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
);

const CounterPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCounterPage {...props} />
  </React.Suspense>
);

const LazyRedisGripPage = React.lazy(() =>
  import(/* webpackChunkName: "RedisGripPage" */ './containers/RedisGripPage')
);

const RedisGripPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyRedisGripPage {...props} />
  </React.Suspense>
);



const LazyAddServerPage = React.lazy(() =>
  import(/* webpackChunkName: "AddServerPage" */ './containers/AddServerPage')
);

const AddServerPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyAddServerPage {...props} />
  </React.Suspense>
);


const LazyEditServerPage = React.lazy(() =>
  import(/* webpackChunkName: "AddServerPage" */ './containers/EditServerPage')
);

const EditServerPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyEditServerPage {...props} />
  </React.Suspense>
);


export default function Routes() {
  return (
      <App>
        <Switch>
          <Route path={routes.COUNTER} component={CounterPage} />
          <Route path={routes.REDISGRIP} component={RedisGripPage} />
          <Route path={routes.ADDSERVER} component={AddServerPage} />
          <Route path={routes.EDITSERVER} component={EditServerPage} />
          <Route path={routes.HOME} component={HomePage} />
        </Switch>
      </App>
  );
}
