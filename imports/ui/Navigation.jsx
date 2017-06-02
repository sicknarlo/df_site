import React from 'react';
import { Link, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import $ from 'jquery';

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggle = this.toggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  toggle(e) {
    e.stopPropagation();
    this.setState({
      open: !this.state.open,
    });
  }

  closeOnMobile() {
    if ($(window).width() < 768) {
      $('body').addClass('mini-navbar');
    }
  }

  handleLogout(e) {
    Meteor.logout(function(err) {
      browserHistory.push('/tools/dashboard');
    })
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
                <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                  <span className="clear">
                    <span className="block m-t-xs">
                      <strong className="font-bold">{currentUser.username}</strong>
                    </span>
                    <span className="text-muted text-xs block">
                      Logged In! <b className="caret"></b>
                    </span>
                  </span>
                </a>
                <ul className="dropdown-menu animated fadeInRight m-t-xs">
                  <li onClick={this.handleLogout}><a href="#" onClick={this.handleLogout}>Log Out</a></li>
                </ul>
              </div>
              <div className="logo-element">
                DFFT
              </div>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/dashboard'}>
                <i className="fa fa-dashboard"></i>
                <span className="nav-label">Dashboard</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/draftmate'}>
                <i className="fa fa-sitemap"></i>
                <span className="nav-label">Draft Mate</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/players'}>
                <i className="fa fa-group"></i>
                <span className="nav-label">Players</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/tradesearch'}>
                <i className="fa fa-search"></i>
                <span className="nav-label">Trade Search</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/tradewizard'}>
                <i className="fa fa-magic"></i>
                <span className="nav-label">Trade Wizard</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/compare'}>
                <i className="fa fa-compass"></i>
                <span className="nav-label">Player Comparison</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/calculator'}>
                <i className="fa fa-exchange"></i>
                <span className="nav-label">Trade Calculator</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/upload-adp'}>
                <i className="fa fa-external-link"></i>
                <span className="nav-label">MFL Draft List</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/aav-generator'}>
                <i className="fa fa-dollar"></i>
                <span className="nav-label">AAV Cheat Sheet Generator</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/faq'}>
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
                      <strong className="font-bold underline"><Link onClick={this.closeOnMobile} to="/tools/login">Log In</Link></strong> <br />
                      or <br />
                      <strong className="font-bold underline"><Link onClick={this.closeOnMobile} to="/tools/signup">Sign Up</Link></strong>
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
              <Link onClick={this.closeOnMobile} to={'/tools/dashboard'}>
                <i className="fa fa-dashboard"></i>
                <span className="nav-label">Dashboard</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/draftmate'}>
                <i className="fa fa-sitemap"></i>
                <span className="nav-label">Draft Mate</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/players'}>
                <i className="fa fa-group"></i>
                <span className="nav-label">Players</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/tradesearch'}>
                <i className="fa fa-search"></i>
                <span className="nav-label">Trade Search</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/tradewizard'}>
                <i className="fa fa-magic"></i>
                <span className="nav-label">Trade Wizard</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/compare'}>
                <i className="fa fa-compass"></i>
                <span className="nav-label">Player Comparison</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/calculator'}>
                <i className="fa fa-calculator"></i>
                <span className="nav-label">Trade Calculator</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/upload-adp'}>
                <i className="fa fa-external-link"></i>
                <span className="nav-label">MFL Draft List</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/aav-generator'}>
                <i className="fa fa-dollar"></i>
                <span className="nav-label">AAV Cheat Sheet Generator</span>
              </Link>
            </li>
            <li onClick={this.handleNavClick} className="">
              <Link onClick={this.closeOnMobile} to={'/tools/faq'}>
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
