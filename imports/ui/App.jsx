import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Teams } from '../api/teams.js';
import PValues from './ADPConst.jsx';
import Navigation from './Navigation.jsx';
import TopNav from './TopNav.jsx';
import Footer from './Footer.jsx';
import $ from 'jquery';
import mixpanel from 'mixpanel-browser';
import { Alert } from 'react-bootstrap';

const CONNECTION_ISSUE_TIMEOUT = 5000;

let playerMap = null;

mixpanel.init("b3957d78fe49d65a13ad277d691d3a8b")
// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playersReady: false,
      menuOpen: false,
      showConnectionIssue: false,
      alertIDs: null,
      db: 'ppr',
      players: [],
      rotoData: [],
      drafts: [],
      showAlert: true,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.setDb = this.setDb.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }
  componentDidMount() {
    const that = this;
    Meteor.call('players.getPlayers', function(error, result){
      if (error) {
      } else {
        playerMap = new Map(result.map((x) => [x.id, x]));
        that.setState({ players: result, playersReady: true, playerMap });
      }
    });

    Meteor.call('drafts.getDrafts', function(error, result) {
      that.setState({ drafts: result });
    });
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
    // const feed = 'http://www.rotoworld.com/rss/feed.aspx?sport=nfl&ftype=news&count=12&format=rss';
    let result = [];
    const t = this;
    $.ajax(
      {
        url: "https://dynastyfftoolsrss.herokuapp.com/v1/feed?url=http://www.rotoworld.com/rss/feed.aspx?sport=nfl&ftype=news&count=12&format=rss&key=1ab23c",
      }
    ).done(
      function(data) {
        if (data) {
          console.log(data);
          result = data.items.map((x) => {
            var item = x;
            var pid = x.link.split('/')[5];
            item.pid = pid;
            return item;
          })
          t.setState({
            rotoData: result,
          });
        }
      }
    );
    // $.ajax({
    //   url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=13&callback=?&q=' + encodeURIComponent(feed),
    //   dataType: 'json',
    //   context: this,
    //   success(data) {
    //     if (data.responseData.feed && data.responseData.feed.entries) {
    //       result = data.responseData.feed.entries;
    //       console.log(result);
    //       // const alertIDs = result.map((item) => item.link.split('/')[5]);
    //       this.setState({
    //         rotoData: result,
    //         // alertIDs
    //       });
    //     }
    //   },
    //   failure(err) {
    //     console.log(err);
    //   }
    // }).done(function() {
    //   console.log('fwop');
    // });
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

  setDb (e) {
    this.setState({ db: e });
  }
  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.playersReady) {
  //     return false;
  //   }
  //   return true;
  // }

  hideAlert() {
    this.setState({ showAlert: false });
  }

  render() {
    // let newsAlerts = [];
    // if (this.state.rotoData && this.props.players) {
    //   newsAlerts = this.state.rotoData.map(function(item) {
    //     const p = this.props.players.filter(function(player) {
    //       return player.rotoworld_id.toString() === item.link.split('/')[5];
    //     });
    //     return {
    //       player: p[0],
    //       content: item,
    //     };
    //   }, this);
    // }

    const v = this.state.db === 'ppr' ? PValues.ppr : PValues.super;

    const alert = (
      <Alert bsStyle="info" onDismiss={this.hideAlert}>
        <div className="row">
          <div className="col-sm-6">
            <p>ADP Updated 4/17</p>
            <p>Rankings Updated 5/2</p>
          </div>
          <div className="col-sm-6">
            <a href="https://medium.com/dynastyfftools/update-5-5-2017-fc1ea1d76ca2">Change Log</a>
          </div>
        </div>
      </Alert>
    )

    if (!this.state.playersReady) {
      return (
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
      );
    }

    return (
      <div id="wrapper">
        <Navigation currentUser = {this.props.currentUser} />
        <div id="page-wrapper" className="gray-bg">
          <TopNav currentUser = {this.props.currentUser} />
          {this.state.showAlert && alert}
          {this.props.children && React.cloneElement(this.props.children, {
            values: v,
            players: this.state.players,
            currentDb: this.state.db,
            setDb: this.setDb,
            currentUser: this.props.currentUser,
            rotoData: this.state.rotoData,
            mixpanel,
            playerMap: this.state.playerMap,
            drafts: this.state.drafts,
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
  // Meteor.subscribe('teams');
  // const subscribeTeams = Meteor.subscribe('teams');
  // const teamsReady = subscribeTeams.ready();
  // const teams = Teams.find({}).fetch();

  return {
    currentUser: Meteor.user(),
  };
}, App);
