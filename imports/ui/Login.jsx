import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Link, browserHistory } from 'react-router';

const currentMonthADP = 'may_16';
const currentMonthValue = 'may_16_value'

const ageCalc = function(birthdate) {
  const ageDifMs = Date.now() - birthdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Player component - represents a Player profile
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      invalid: false,
      error: false,
      usernameRequired: false,
      sent: false,
      menuOpen: false,
      showConnectionIssue: false,
    };
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateUsername(e) {
    console.log(this.state);
    this.setState({ username: e.target.value });
  }
  updatePassword(e) {
    console.log(this.state);
    this.setState({ password: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();

    if (!this.state.username || !this.state.password) {
      this.setState({ invalid: true, usernameRequired: false, error: false, sent: false });
      return;
    } else {
      this.setState({ invalid: false, usernameRequired: false, error: false, sent: false });
    }

    Meteor.loginWithPassword(this.state.username, this.state.password, err => {
      if (err) {
        this.setState({ invalid: false, usernameRequired: false, error: true, sent: false });
        console.log(err);
      } else {
        console.log('sucksess');
        browserHistory.push('/dashboard');
      }
    });
  }
  render() {
    return (
      <div className="middle-box text-center loginscreen animated fadeInDown">
        <div>
          <div>
            <h1 className="logo-name">DF+</h1>
          </div>
          <h3>Welcome to the Dynasty Fantasy Hub</h3>
          <p>Login to add your teams, watch your players, and customize your experience.
          </p>
          <form className="m-t" role="form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                onChange={this.updateUsername}
                value={this.state.username}
                required="" />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={this.state.password}
                onChange={this.updatePassword}
                required="" />
            </div>
              <button type="submit" className="btn btn-primary block full-width m-b">Login</button>
              <p className="text-muted text-center"><small>Do not have an account?</small></p>
              <Link className="btn btn-sm btn-white btn-block" to="signup">Create an account</Link>
          </form>
      </div>
  </div>
    );
  }
}

Login.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
  sortGrp: PropTypes.string.isRequired,
};

Login.contextTypes = {
  router: React.PropTypes.func,
};
