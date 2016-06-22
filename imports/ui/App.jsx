import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Players } from '../api/players.js';
import { Teams } from '../api/teams.js';

import Player from './Player.jsx'

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
      rotoData: null,
      alertIDs: null,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
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
    const feed = 'http://www.rotoworld.com/rss/feed.aspx?sport=nfl&ftype=news&count=12&format=rss';
    let result = [];
    $.ajax({
      url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=13&callback=?&q=' + encodeURIComponent(feed),
      dataType: 'json',
      context: this,
      success(data) {
        if (data.responseData.feed && data.responseData.feed.entries) {
          result = data.responseData.feed.entries;
          // const alertIDs = result.map((item) => item.link.split('/')[5]);
          this.setState({
            rotoData: result,
            // alertIDs
          });
        }
      },
    });
  }

  // componentWillUpdate() {
  //   const alerts = this.state.rotoData.map(function(item) {
  //     const playerID = item.link.split('/')[5];
  //     const player = this.props.players.find((p) => p._id._str === playerID);
  //     return {
  //       player,
  //       content: $.parseHTML(item.content)[0].data,
  //       link: item.link,
  //     }
  //   })
  // }

  render() {
    let newsAlerts = [];
    if (this.state.rotoData && this.props.players) {
      newsAlerts = this.state.rotoData.map(function(item) {
        const p = this.props.players.filter(function(player) {
          return player.rotoworld_id.toString() === item.link.split('/')[5];
        });
        return {
          player: p[0],
          content: item,
        };
      }, this);
    }
    console.log(this.props);
    return (
      <div id="wrapper">
        <Navigation currentUser = {this.props.currentUser} />
        <div id="page-wrapper" className="gray-bg">
          <TopNav currentUser = {this.props.currentUser} />
          {this.props.children && React.cloneElement(this.props.children, {
            players: this.props.players,
            currentUser: this.props.currentUser,
            newsAlerts,
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
  Meteor.subscribe('teams');

  return {
    players: Players.find({}, { sort: { may_16: 1 } }).fetch(),
    teams: Teams.find({}).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
