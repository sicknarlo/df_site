import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Link, browserHistory } from 'react-router';
import { Accounts } from 'meteor/accounts-base';


// Player component - represents a Player profile
export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = { errors: {} };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const username = this.refs.username.value;
    const password = this.refs.password.value;
    const confirm = this.refs.confirm.value;
    const errors = {};

    if (!username) {
      errors.username = 'Username required';
    }
    if (!password) {
      errors.password = 'Password required';
    }
    if (confirm !== password) {
      errors.confirm = 'Please confirm your password';
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }

    Accounts.createUser({
      username,
      password,
    }, err => {
      if (err) {
        this.setState({
          errors: { none: err.reason },
        });
        console.log(err);
      }
      browserHistory.push('/dashboard');
    });
  }
  render() {
    const { errors } = this.state;
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const errorClass = key => errors[key] && 'error';
    return (
      <div className="middle-box text-center loginscreen animated fadeInDown">
        <div>
            <h1 className="logo-name">DF+</h1>
        </div>
        <h3>Sign Up for the Dynasty Fantasy Hub Tools</h3>

        <p>Create account to add your teams, watch players, and more.</p>

        <form className="m-t" role="form" action="#" onSubmit={this.onSubmit}>
            <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  required=""
                  ref="username" />
            </div>
            <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  required=""
                  ref="password" />
            </div>
            <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                  required=""
                  ref="confirm" />
            </div>

            <button type="submit" className="btn btn-primary block full-width m-b">Create Account</button>

            <p className="text-muted text-center">
                <small>Already have an account?</small>
            </p>
            <Link className="btn btn-sm btn-white btn-block" to='login'>Login</Link>
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
