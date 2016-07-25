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
import Landing from '../ui/Landing.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Landing} />
    <Route path="/tools" component={App}>
      <Route path="/tools/dashboard" component={Dashboard} />
      <Route path="/tools/login" component={Login} />
      <Route path="/tools/signup" component={SignUp} />
      <Route path="/tools/players" component={Players} />
      <Route path="/tools/players/:playerID" component={Player} />
      <Route path="/tools/compare" component={Compare} />
      <Route path="/tools/calculator" component={Calculator} />
      <Route path="/tools/teams/:teamID" component={Team} />
      <Route path="/tools/createteam" component={CreateTeam} />
      <Route path="/tools/hokeypokey" component={UpdateValues} />
    </Route>
  </Router>
);