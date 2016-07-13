import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

// route components
import App from '../ui/App.jsx';
import Players from '../ui/Players.jsx';
import Player from '../ui/Player.jsx';
import Compare from '../ui/Compare.jsx';
import Calculator from '../ui/Calculator.jsx';
import Dashboard from '../ui/Dashboard.jsx';
import Login from '../ui/Login.jsx';
import SignUp from '../ui/SignUp.jsx';
import CreateTeam from '../ui/CreateTeam.jsx';
import Team from '../ui/Team.jsx';
import UpdateValues from '../ui/UpdateValues.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/players" component={Players} />
      <Route path="/players/:playerID" component={Player} />
      <Route path="/compare" component={Compare} />
      <Route path="/calculator" component={Calculator} />
      {/*<Route path="/teams" component={Teams} />*/}
      <Route path="/teams/:teamID" component={Team} />
      <Route path="/createteam" component={CreateTeam} />
      <Route path="/hokeypokey" component={UpdateValues} />
    </Route>
  </Router>
);


{/*<Route path="lists/:id" component={ListContainer} />*/}
