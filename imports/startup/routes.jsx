import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

// route components
import App from '../ui/App.jsx';
import Players from '../ui/Players.jsx';
import Player from '../ui/Player.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/players" component={Players} />
      <Route path="/players/:playerID" component={Player} />
    </Route>
  </Router>
);


{/*<Route path="lists/:id" component={ListContainer} />*/}
