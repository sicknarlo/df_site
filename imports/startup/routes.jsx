import React from 'react';
import { Router, Route, browserHistory, Redirect } from 'react-router';

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
import FAQ from '../ui/FAQ.jsx';
import DraftMateCreate from '../ui/DraftMateCreate.jsx';
import DraftMate from '../ui/DraftMate.jsx';
import DraftMateStart from '../ui/DraftMateStart.jsx';
import TradeSearch from '../ui/TradeSearch.jsx';
import ReactGA from 'react-ga';
import UploadADP from '../ui/UploadADP';
import AAVGenerator from '../ui/AAVGenerator';
import TradeFinder from '../ui/TradeFinder';
import PlayerDeepDive from '../ui/PlayerDeepDive';

ReactGA.initialize('UA-67151916-1');

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

export const renderRoutes = () => (
  <Router history={browserHistory} onUpdate={logPageView}>
    <Route path="/" component={Landing} />
    <Redirect from="/players" to="/tools/players" />
    <Redirect from="/calculator" to="/tools/calculator" />
    <Redirect from="/calculator-2qb" to="/tools/calculator" />
    <Redirect from="/draftmate" to="/tools/draftmate" />
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
      <Route path="/tools/faq" component={FAQ} />
      <Route path="/tools/draftmate/create" component={DraftMateCreate} />
      <Route path="/tools/draftmate/:draftMateID" component={DraftMate} />
      <Route path="/tools/draftmate" component={DraftMateStart} />
      <Route path="/tools/tradesearch" component={TradeSearch} />
      <Route path="/tools/upload-adp" component={UploadADP} />
      <Route path="/tools/aav-generator" component={AAVGenerator} />
      <Route path="/tools/tradewizard" component={TradeFinder} />
      <Route path="/tools/deepdive" component={PlayerDeepDive} />
    </Route>
  </Router>
);
