import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Link, browserHistory } from 'react-router';

// Player component - represents a Player profile
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const username = this.refs.username.value;
    const password = this.refs.password.value;
    const errors = {};

    if (!username) {
      errors.username = 'Username required';
    }
    if (!password) {
      errors.password = 'Password required';
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      this.setState({ loading: false });
      return;
    }
    try {
      Meteor.loginWithPassword(username, password, err => {
        if (err) {
          this.setState({
            errors: { none: err.reason },
            loading: false,
          });
          return;
        }
        browserHistory.push('/tools/dashboard');
      });
    } catch (err) {
      debugger;
    }
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
