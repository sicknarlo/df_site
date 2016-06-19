import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Players } from '../api/players.js';
import Player from './Player.jsx'

// import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import Navigation from './Navigation.jsx';
import TopNav from './TopNav.jsx';
import Footer from './Footer.jsx';
import $ from 'jquery';

const CONNECTION_ISSUE_TIMEOUT = 5000;

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playersReady: false,
      menuOpen: false,
      showConnectionIssue: false,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ showConnectionIssue: true });
    }, CONNECTION_ISSUE_TIMEOUT);

    // Minimalize menu when screen is less than 768px
    $(window).bind('resize load', function() {
      if ($(this).width() < 769) {
        $('body').addClass('body-small');
      } else {
        $('body').removeClass('body-small');
      }
    });

    // Fix height of layout when resize, scroll and load
    $(window).bind('load resize scroll', function() {
      if (!$('body').hasClass('body-small')) {
        const navbarHeigh = $('nav.navbar-default').height();
        const wrapperHeigh = $('#page-wrapper').height();

        if (navbarHeigh > wrapperHeigh) {
          $('#page-wrapper').css('min-height', `${navbarHeigh}px`);
        }

        if (navbarHeigh < wrapperHeigh) {
          $('#page-wrapper').css('min-height', `${$(window).height()}px`);
        }

        if ($('body').hasClass('fixed-nav')) {
          if (navbarHeigh > wrapperHeigh) {
            $('#page-wrapper').css('min-height', `${navbarHeigh - 60}px`);
          } else {
            $('#page-wrapper').css('min-height', `${$(window).height() - 60}px`);
          }
        }
      }
    });


    // SKIN OPTIONS
    // Uncomment this if you want to have different skin option:
    // Available skin: (skin-1 or skin-3, skin-2 deprecated, md-skin)
    // $('body').addClass('skin-1');

    // FIXED-SIDEBAR
    // Uncomment this if you want to have fixed left navigation
    $('body').addClass('fixed-sidebar');
    // $('.sidebar-collapse').slimScroll({
    //   height: '100%',
    //   railOpacity: 0.9,
    // });

    // BOXED LAYOUT
    // Uncomment this if you want to have boxed layout
    // $('body').addClass('boxed-layout');
  }

  render() {
    // console.log(this.props.players);
    return (
      <div id="wrapper">
        <Navigation />
        <div id="page-wrapper" className="gray-bg">
          <TopNav />
          {this.props.children && React.cloneElement(this.props.children, {
            players: this.props.players
          })}
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  players: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('players');

  return {
    players: Players.find({}, { sort: { may_16: 1 } }).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
