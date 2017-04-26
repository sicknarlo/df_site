import React from 'react';
import $ from 'jquery';

export default class TopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  componentWillMount() {
    // $('body').addClass('fixed-nav');
    // $('.navbar-static-top').removeClass('navbar-static-top').addClass('navbar-fixed-top');
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

  render() {
    return (
      <div className="row border-bottom">
        <nav className="navbar navbar-fixed-top" role="navigation" style={{ marginBottom: 0 }}>
          <div className="navbar-header">
            <div
              id="navbar-minimalize"
              onClick={this.toggleSideNav}
              className="minimalize-styl-2 btn btn-primary"
              href="#"
            >
              <i className="fa fa-bars"></i>
            </div>
            <div className="toplogo">
              <h3>DynastyFFTools.com <br /><small>Updated 4/17/2017</small></h3>
            </div>
          </div>
        </nav>
    </div>
    );
  }
}

TopNav.propTypes = {
  currentUser: React.PropTypes.object,
  logout: React.PropTypes.func,
};
