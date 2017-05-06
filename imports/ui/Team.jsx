import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Link, browserHistory } from 'react-router';
import TeamPage from './TeamPage.jsx';

export default class Team extends Component {

  constructor(props) {
    super(props);
    this.state = {
      team: null,
    };
  }

  componentDidMount() {
    const that = this;
    Meteor.call('teams.getTeam', {
      id: this.props.params.teamID,
      user: this.props.currentUser,
    }, (error, result) => {
      if (error) browserHistory.push('/tools/dashboard');
      if (result[0].owner !== this.props.currentUser._id) browserHistory.push('/tools/dashboard');
      that.setState({ teamReady: true, team: result[0] });
    })
  }
  renderLoggedOut() {
    return (
      <div>
        <div className="row  border-bottom white-bg dashboard-header">
          <div className="col-sm-12 text-center">
            <h1>You are not logged in.</h1>
            <h3>
              <Link to="/tools/login">Log In</Link>
              {' '}
              or
              {' '}
              <Link to="/tools/signup">Sign Up</Link>
              {' '}
              to use the dashboard. It's free!
            </h3>
          </div>
        </div>
      </div>
    );
  }

  renderLoggedIn() {
    if (this.state.team) {
      return (
        <TeamPage
          team={this.state.team}
          players={this.props.players}
          currentUser={this.props.currentUser}
          newsAlerts={this.props.newsAlerts}
          values={this.props.values}
          currentDb={this.props.currentDb}
        />
      );
    } else {
      return null;
    }
  }

  render() {
    return this.props.currentUser ? this.renderLoggedIn() : this.renderLoggedOut();
  }
}

Team.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
