import React from 'react';
import { Link } from 'react-router';

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.stopPropagation();
    this.setState({
      open: !this.state.open,
    });
  }

  renderLoggedIn() {
    // const { open } = this.state;
    const { currentUser } = this.props;
    // const email = user.emails[0].address;
    // const emailLocalPart = email.substring(0, email.indexOf('@'));

    return (
      <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">
          {/*<a className="close-canvas-menu"><i className="fa fa-times"></i></a>*/}
          <ul className="nav metismenu" id="side-menu">
            <li className="nav-header">
              <div className="dropdown profile-element">
                <a className="dropdown-toggle" href="#">
                  <span className="clear">
                    <span className="block m-t-xs">
                      <strong className="font-bold">{currentUser.username}</strong>
                    </span>
                    <span className="text-muted text-xs block">
                      Logged In! <b className="caret"></b>
                    </span>
                  </span>
                </a>
                {/*<ul className="dropdown-menu animated fadeInRight m-t-xs">
                  <li><a href="#">Item</a></li>
                  <li><a href="#">Item</a></li>
                  <li className="divider"></li>
                  <li><a href="#">Item</a></li>
                </ul>*/}
              </div>
              <div className="logo-element">
                DFFT
              </div>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link to={'/tools/dashboard'}>
                <i className="fa fa-dashboard"></i>
                <span className="nav-label">Dashboard</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link to={'/tools/players'}>
                <i className="fa fa-group"></i>
                <span className="nav-label">Players</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link to={'/tools/compare'}>
                <i className="fa fa-compass"></i>
                <span className="nav-label">Player Comparison</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link to={'/tools/calculator'}>
                <i className="fa fa-exchange"></i>
                <span className="nav-label">Trade Calculator</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link to={'/tools/faq'}>
                <i className="fa fa-question"></i>
                <span className="nav-label">FAQ</span>
              </Link>
            </li>
          </ul>

        </div>
    </nav>
    );
  }

  renderLoggedOut() {
    return (
      <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">
          {/*<a className="close-canvas-menu"><i className="fa fa-times"></i></a>*/}
          <ul className="nav metismenu" id="side-menu">
            <li className="nav-header">
              <div className="dropdown profile-element">
                <a className="dropdown-toggle" href="#">
                  <span className="clear">
                    <div className="block m-t-xs topNav">
                      <strong className="font-bold underline"><Link to="/tools/login">Log In</Link></strong> <br />
                      or <br />
                      <strong className="font-bold underline"><Link to="/tools/signup">Sign Up</Link></strong>
                    </div>
                  </span>
                </a>
                {/*<ul className="dropdown-menu animated fadeInRight m-t-xs">
                  <li><a href="#">Item</a></li>
                  <li><a href="#">Item</a></li>
                  <li className="divider"></li>
                  <li><a href="#">Item</a></li>
                </ul>*/}
              </div>
              <div className="logo-element">
                DFHQ
              </div>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link to={'/tools/dashboard'}>
                <i className="fa fa-dashboard"></i>
                <span className="nav-label">Dashboard</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link to={'/tools/players'}>
                <i className="fa fa-group"></i>
                <span className="nav-label">Players</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link to={'/tools/compare'}>
                <i className="fa fa-compass"></i>
                <span className="nav-label">Player Comparison</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link to={'/tools/calculator'}>
                <i className="fa fa-calculator"></i>
                <span className="nav-label">Trade Calculator</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link to={'/tools/faq'}>
                <i className="fa fa-question"></i>
                <span className="nav-label">FAQ</span>
              </Link>
            </li>
          </ul>

        </div>
    </nav>
    );
  }

  render() {
    return this.props.currentUser
      ? this.renderLoggedIn()
      : this.renderLoggedOut();
  }
}

Navigation.propTypes = {
  currentUser: React.PropTypes.object,
  logout: React.PropTypes.func,
};
