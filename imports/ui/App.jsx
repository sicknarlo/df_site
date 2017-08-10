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
      loadError: false,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.render = this.render.bind(this);
    this.setDb = this.setDb.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
  }
  componentDidMount() {
    const that = this;
    let load = 0;

    const count = setInterval(() => {
      load++;
      if (load > 15) {
        this.setState({ loadError: true });
        clearInterval(count);
      }
    }, 1000);
    console.time('load');
    Meteor.apply('players.getPlayers', [], {
      onResultReceived: (err, result) => {
          console.timeEnd('load');
        playerMap = new Map(result.map((x) => [x.id, x]));
        clearInterval(count);
        that.setState({ players: result, playersReady: true, playerMap, loadError: false });
      }
    }, (error, result) => {
        if (!this.state.players) {
          playerMap = new Map(result.map((x) => [x.id, x]));
          clearInterval(count);
          that.setState({ players: result, playersReady: true, playerMap, loadError: false });
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

    const loadAlert = (
      <Alert bsStyle="danger" onDismiss={() => this.setState({ loadError: false })}>
        <div className="row">
          <div className="col-lg-12">
            Sorry for the delay, we're having technical issues. Continue waiting or try again later. If this continues <a href='https://twitter.com/DynastyFFTools'>Send us a tweet and we'll get it resolved.</a>
          </div>
        </div>
      </Alert>
    );

    if (!this.state.playersReady) {
      return (
        <div className="overlay">
          {this.state.loadError && loadAlert}
          {!this.state.loadError && <Alert bsStyle="warning">
            <div className="row">
              <div className="col-lg-12">
                Initial load times can be long, but the app is fast once loaded. Thanks for being patient!
              </div>
            </div>
          </Alert>
        }
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

    const v = this.state.db === 'ppr' ? PValues.ppr : PValues.super;

    const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

    const updated = this.state.players[0] && this.state.players[0].adp[0].time ? new Date(this.state.players[0].adp[0].time) : new Date('June 1 2017');
    const current = new Date();

    const diffDays = Math.round(Math.abs((updated.getTime() - current.getTime())/(oneDay)));

    const freshness = 100 - (diffDays * 2.85) > 0 ? 100 - (diffDays * 2.85) : 0;

    let classes = 'progress-bar';

    if (freshness > 75) {
      classes += ' greenBackground';
    } else if (freshness < 51 && freshness > 25) {
      classes += ' progress-bar-warning';
    } else if (freshness < 26) {
      classes += ' progress-bar-danger';
    }

    const alert = (
      <Alert bsStyle="info" onDismiss={this.hideAlert}>
        <div className="row">
          <div className="col-lg-12">
            {/* <div>
              <span>ADP Freshness</span>
              <small className="pull-right">{updated.toDateString()}</small>
            </div>
            <div className="progress progress-small">
              <div style={{ width: `${freshness}%` }} className={classes}></div>
            </div> */}
            <a href="https://medium.com/dynastyfftools/update-8-10-2017-aav-fixed-89916d8d82b0">Change Log</a>
          </div>
        </div>
      </Alert>
    );



    return (
      <div id="wrapper">
        <Navigation currentUser={this.props.currentUser} />
        <div id="page-wrapper" className="gray-bg">
          <TopNav currentUser={this.props.currentUser} updated={updated} />
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