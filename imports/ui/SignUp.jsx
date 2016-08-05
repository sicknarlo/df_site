import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Link, browserHistory } from 'react-router';
import { Accounts } from 'meteor/accounts-base';


// Player component - represents a Player profile
export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      loading: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    const username = this.refs.username.value;
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const confirm = this.refs.confirm.value;
    const errors = {};

    if (!username) {
      errors.username = 'Username required';
    }
    if (!email) {
      errors.email = 'Email required';
    }
    if (!password) {
      errors.password = 'Password required';
    }
    if (confirm !== password) {
      errors.confirm = 'Please confirm your password';
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      this.setState({ loading: false });
      return;
    }

    Accounts.createUser({
      username,
      email,
      password,
    }, err => {
      if (err) {
        this.setState({
          errors: { none: err.reason },
          loading: false,
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
    const loading = this.state.loading
      ? (
        <div className="overlay">
          <div className="sk-spinner sk-spinner-cube-grid">
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
              <div className="sk-cube"></div>
          </div>
        </div>
      )
      : null;

    return (
      <div className="middle-box text-center loginscreen animated fadeInDown">
        {loading}
        <div>
            <h1 className="logo-name">DF+</h1>
        </div>
        <h3>Sign Up for DynastyFF Tools</h3>

        <p>Create account to add your teams, watch players, and more.</p>

        <form className="m-t" role="form" action="#" onSubmit={this.onSubmit}>
          <div className="list-errors">
            {errorMessages.map(msg => (
              <div className="list-item alert alert-danger" key={msg}>{msg}</div>
            ))}
          </div>
            <div className="form-group">
                <input
                  type="text"
                  className={`form-control ${errorClass('username')}`}
                  placeholder="Username"
                  required=""
                  ref="username" />
            </div>
            <div className="form-group">
                <input
                  type="email"
                  className={`form-control ${errorClass('email')}`}
                  placeholder="Email"
                  required=""
                  ref="email" />
            </div>
            <div className="form-group">
                <input
                  type="password"
                  className={`form-control ${errorClass('password')}`}
                  placeholder="Password"
                  required=""
                  ref="password" />
            </div>
            <div className="form-group">
                <input
                  type="password"
                  className={`form-control ${errorClass('confirm')}`}
                  placeholder="Confirm Password"
                  required=""
                  ref="confirm" />
            </div>

            <button type="submit" className="btn btn-primary block full-width m-b">Create Account</button>

            <p className="text-muted text-center">
                <small>Already have an account?</small>
            </p>
            <Link className="btn btn-sm btn-white btn-block" to='/tools/login'>Login</Link>
        </form>
    </div>
    );
  }
}

SignUp.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
  sortGrp: PropTypes.string.isRequired,
};

SignUp.contextTypes = {
  router: React.PropTypes.func,
};
