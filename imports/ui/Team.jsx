import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import { Link, browserHistory } from 'react-router';
import $ from 'jquery';

import PlayerRow from './PlayerRow.jsx';
import PageHeading from './PageHeading.jsx';
import DashboardLoggedOut from './DashboardLoggedOut.jsx';
import DashboardLoggedIn from './DashboardLoggedIn.jsx';
import TeamPage from './TeamPage.jsx';
import Values from './ADPConst.jsx';

const currentMonthADP = Values.past6MonthsADP[5];
const currentMonthValue = Values.past6MonthsValue[5];
const chartLabels = Values.chartLabels;
const past6MonthsValue = Values.past6MonthsValue;
const past6MonthsADP = Values.past6MonthsADP;

const ageCalc = function(birthdate) {
  const bdate = birthdate ? birthdate : 680000000;
  const ageDifMs = Date.now() - bdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default class Team extends Component {
  renderLoggedOut() {
    return (
      <div>
        <div className="row  border-bottom white-bg dashboard-header">
          <div className="col-sm-12 text-center">
            <h1>You are not logged in.</h1>
            <h3><Link to="/tools/login">Log In</Link> or <Link to="/tools/signup">Sign Up</Link> to use the dashboard. It's free!</h3>
          </div>
        </div>
      </div>
    )
  }

  renderLoggedIn() {
    const team = this.props.teams.find((t) => t._id === this.props.params.teamID);
    console.log(team);
    if (team) {
      return <TeamPage
              team={team}
              currentUser={this.props.currentUser}
              players={this.props.players}
              newsAlerts={this.props.newsAlerts} />
    } else {
      browserHistory.push('/tools/dashboard');
    }
  }

  render() {

    return this.props.currentUser
      ? this.renderLoggedIn()
      : this.renderLoggedOut();
  }
}

Team.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
