import React from 'react';
import { Link, browserHistory } from 'react-router';
import $ from 'jquery';
import { Meteor } from 'meteor/meteor';

export default class TopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
  }
  componentWillMount() {
    // $('body').addClass('fixed-nav');
    // $('.navbar-static-top').removeClass('navbar-static-top').addClass('navbar-fixed-top');
  }

  handleLogout() {
    Meteor.logout(function(err) {
      console.log(err);
    })
    browserHistory.push('/dashboard');
  }

  toggleSideNav() {
    // Toggle left navigation

    event.preventDefault();

    // Toggle special class
    $('body').toggleClass('mini-navbar');

    // Enable smoothly hide/show menu
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
      // Hide menu in order to smoothly turn on when maximize menu
      $('#side-menu').hide();
      // For smoothly turn on menu
      setTimeout(
        function () {
          $('#side-menu').fadeIn(400);
        }, 200);
    } else if ($('body').hasClass('fixed-sidebar')) {
      $('#side-menu').hide();
      setTimeout(
        function () {
          $('#side-menu').fadeIn(400);
        }, 100);
    } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
      $('#side-menu').removeAttr('style');
    }
  }

  renderLogoutButton() {
    return (
      <ul className="nav navbar-top-links navbar-right">
        <li>
          <a href="#" onClick={this.handleLogout}>
            <i className="fa fa-sign-out"></i> Log out
          </a>
        </li>

      </ul>
    )
  }

  render() {
    return (
      <div className="row border-bottom">
        <nav className="navbar" role="navigation" style={{ marginBottom: 0 }}>
          <div className="navbar-header">
            <div
              id="navbar-minimalize"
              onClick={this.toggleSideNav}
              className="minimalize-styl-2 btn btn-primary"
              href="#"
            >
              <i className="fa fa-bars"></i>
            </div>
            <form role="search" className="navbar-form-custom" action="search_results">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Search for something..."
                  className="form-control"
                  name="top-search"
                  id="top-search" />
              </div>
            </form>
          </div>
          {this.props.currentUser && this.renderLogoutButton()}

        </nav>
    </div>
    );
  }
}

TopNav.propTypes = {
  currentUser: React.PropTypes.object,
  logout: React.PropTypes.func,
};
