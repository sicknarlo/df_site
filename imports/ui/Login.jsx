import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Link, browserHistory } from 'react-router';
import Values from './ADPConst.jsx';

const currentMonthADP = Values.past6MonthsADP[5];
const currentMonthValue = Values.past6MonthsValue[5];

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
      errors: {},
      // username: '',
      // password: '',
      // invalid: false,
      // error: false,
      // usernameRequired: false,
      // sent: false,
      // menuOpen: false,
      // showConnectionIssue: false,
    };
    // this.updateUsername = this.updateUsername.bind(this);
    // this.updatePassword = this.updatePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // updateUsername(e) {
  //   this.setState({ username: e.target.value });
  // }
  // updatePassword(e) {
  //   this.setState({ password: e.target.value });
  // }
  handleSubmit(e) {
    e.preventDefault();
    const username = this.refs.username.value;
    const password = this.refs.password.value;
    const errors = {}

    if (!username) {
      errors.username = 'Username required';
    }
    if (!password) {
      errors.password = 'Password required';
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }

    Meteor.loginWithPassword(username, password, err => {
      if (err) {
        this.setState({
          errors: { none: err.reason },
        });
        return;
      }
      browserHistory.push('/tools/dashboard');
    });
  }
  render() {
    const { errors } = this.state;
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const errorClass = key => errors[key] && 'error';

    return (
      <div className="middle-box text-center loginscreen animated fadeInDown">
        <div>
          <div>
            <h1 className="logo-name">DF+</h1>
          </div>
          <h3>Welcome to DynastyFF Tools</h3>
          <p>Login to add your teams, watch your players, and customize your experience.
          </p>
          <form className="m-t" role="form" onSubmit={this.handleSubmit}>
            <div className="list-errors">
              {errorMessages.map(msg => (
                <div className="list-item alert alert-danger" key={msg}>{msg}</div>
              ))}
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                ref="username"
                required="" />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                ref="password"
                required="" />
            </div>
              <button type="submit" className="btn btn-primary block full-width m-b">Login</button>
              <p className="text-muted text-center"><small>Do not have an account?</small></p>
              <Link className="btn btn-sm btn-white btn-block" to="/tools/signup">Create an account</Link>
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
