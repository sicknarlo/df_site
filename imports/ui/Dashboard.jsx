import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import { Link } from 'react-router';
import $ from 'jquery';
import PlayerRow from './PlayerRow.jsx';
import PageHeading from './PageHeading.jsx';
import DashboardLoggedOut from './DashboardLoggedOut.jsx';
import DashboardLoggedIn from './DashboardLoggedIn.jsx';
import PValues from './ADPConst.jsx';
import { Button, ButtonGroup } from 'react-bootstrap';
import ActivityStream from './ActivityStream.jsx';


const ageCalc = function(birthdate) {
  const bdate = birthdate ? birthdate : 680000000;
  const ageDifMs = Date.now() - bdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topTrendersPPR: [],
      bottomTrendersPPR: [],
      topTrendersSuper: [],
      bottomTrendersSuper: [],
      underValuedPPR: [],
      underValuedSuper: [],
      overValuedPPR: [],
      overValuedSuper: [],
      winNowPPR: [],
      winNowSuper: [],
    };
    this.trackClick = this.trackClick.bind(this);
  }

  componentDidMount() {
    const that = this;
    Meteor.call('teams.getStandardTopTrenders', function(error, result){
      if (error) {
      } else {
        that.setState({ topTrendersPPR: result })
      }
    });
    Meteor.call('teams.get2QBTopTrenders', function(error, result){
      if (error) {
      } else {
        that.setState({ topTrendersSuper: result })
      }
    });
    Meteor.call('teams.getStandardBottomTrenders', function(error, result){
      if (error) {
      } else {
        that.setState({ bottomTrendersPPR: result })
      }
    });
    Meteor.call('teams.get2QBBottomTrenders', function(error, result){
      if (error) {
      } else {
        that.setState({ bottomTrendersSuper: result })
      }
    });
    Meteor.call('teams.getStandardUnderValuedPlayers', function(error, result){
      if (error) {
      } else {
        that.setState({ underValuedPPR: result })
      }
    });
    Meteor.call('teams.get2QBUnderValuedPlayers', function(error, result){
      if (error) {
      } else {
        that.setState({ underValuedSuper: result })
      }
    });
    Meteor.call('teams.getStandardOverValuedPlayers', function(error, result){
      if (error) {
      } else {
        that.setState({ overValuedPPR: result })
      }
    });
    Meteor.call('teams.get2QBOverValuedPlayers', function(error, result){
      if (error) {
      } else {
        that.setState({ overValuedSuper: result })
      }
    });
    Meteor.call('teams.getStandardWinNowPlayers', function(error, result){
      if (error) {
      } else {
        that.setState({ winNowPPR: result })
      }
    });
    Meteor.call('teams.get2QBWinNowPlayers', function(error, result){
      if (error) {
      } else {
        that.setState({ winNowSuper: result })
      }
    });
  }
  // componentWillMount() {
  //   const feed = 'http://www.rotoworld.com/rss/feed.aspx?sport=nfl&ftype=news&count=12&format=rss';
  //   const test = this
  //   $.ajax({
  //     url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(feed),
  //     dataType: 'json',
  //     context:
  //     success(data) {
  //       if (data.responseData.feed && data.responseData.feed.entries) {
  //         this.setState({ rotoData: data });
  //       }
  //     }
  //   }).bind(this);
  // }
  updateDb(e) {
    this.props.setDb(e);
  }

  trackClick() {
    this.props.mixpanel.track('dashboard player clicked');
  }

  render() {
    if (
      this.state.topTrendersPPR.length === 0
      && this.state.bottomTrendersPPR.length === 0
      && this.state.topTrendersSuper.length === 0
      && this.state.bottomTrendersSuper.length === 0
    ) {
      return (
          <div className="sk-spinner sk-spinner-double-bounce">
            <div className="sk-double-bounce1"></div>
            <div className="sk-double-bounce2"></div>
          </div>
      );
    }
    console.log(this.props.rotoData);

    const risers = this.props.currentDb === 'ppr' ? this.state.topTrendersPPR : this.state.topTrendersSuper;
    const fallers = this.props.currentDb === 'ppr' ? this.state.bottomTrendersPPR : this.state.bottomTrendersSuper;
    const overs = this.props.currentDb === 'ppr' ? this.state.overValuedPPR : this.state.overValuedSuper;
    const unders = this.props.currentDb === 'ppr' ? this.state.underValuedPPR : this.state.underValuedSuper;
    const nows = this.props.currentDb === 'ppr' ? this.state.winNowPPR : this.state.winNowSuper;
    const dashboard = this.props.currentUser
    ? <DashboardLoggedIn
        teamsReady={this.props.teamsReady}
        newsAlerts={this.props.newsAlerts}
        currentUser={this.props.currentUser}
        teams={this.props.teams}
        currentDb={this.props.currentDb} />
    : <DashboardLoggedOut
        players={this.props.players}
        newsAlerts={this.props.newsAlerts}
        currentDb={this.props.currentDb} />
    const pprButtonActive = this.props.currentDb === 'ppr' ? 'primary' : '';
    const qbButtonActive = this.props.currentDb === '2qb' ? 'primary' : '';
    return (
      <div>
          <div className="row dbToggle">
            <div className="flex justifyCenter">
                <ButtonGroup>
                    <Button
                        className="tradeButton"
                        bsSize="large"
                        bsStyle={pprButtonActive}
                        value="ppr"
                        onClick={this.updateDb.bind(this, 'ppr')}>
                          Standard
                     </Button>
                     <Button
                         className="tradeButton"
                         bsSize="large"
                         bsStyle={qbButtonActive}
                         value="2qb"
                         onClick={this.updateDb.bind(this, '2qb')}>
                           2QB
                     </Button>
                </ButtonGroup>
            </div>
          </div>
        {dashboard}
        <div className="wrapper wrapper-content">
          <ActivityStream players={this.props.players} rotoData={this.props.rotoData} />
          <div className="row">
            <div className="col-md-6">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Top 3 Month Risers</h5>
                </div>
                <div className="ibox-content">
                  <table className="table">
                    <thead>
                      <th>Name</th>
                      <th>ADP</th>
                      <th>3mo Trend</th>
                    </thead>
                    <tbody>
                      {risers.map((player) =>
                        <tr>
                          <td><Link onClick={this.trackClick} to={`/tools/players/${player._id._str}`}>{player.name}</Link></td>
                          <td>{player.adp[0][this.props.values.adpKey]}</td>
                          <td>+{player.trend}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Top 3 Month Fallers</h5>
                </div>
                <div className="ibox-content">
                <table className="table">
                  <thead>
                    <th>Name</th>
                    <th>ADP</th>
                    <th>3mo Trend</th>
                  </thead>
                  <tbody>
                    {fallers.map((player) =>
                      <tr>
                        <td><Link onClick={this.trackClick} to={`/tools/players/${player._id._str}`}>{player.name}</Link></td>
                        <td>{player.adp[0][this.props.values.adpKey]}</td>
                        <td>{player.trend}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Over Valued Players</h5>
                </div>
                <div className="ibox-content">
                  <table className="table">
                    <thead>
                      <th>Name</th>
                      <th>ADP</th>
                      <th>Rank</th>
                    </thead>
                    <tbody>
                      {overs.map((player) =>
                        <tr>
                          <td><Link onClick={this.trackClick} to={`/tools/players/${player._id._str}`}>{player.name}</Link></td>
                          <td>{player.adp[0][this.props.values.adpKey]}</td>
                          <td>{player.rankings[0][this.props.values.rankKey]}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Under Valued Players</h5>
                </div>
                <div className="ibox-content">
                <table className="table">
                  <thead>
                    <th>Name</th>
                    <th>ADP</th>
                    <th>Rank</th>
                  </thead>
                  <tbody>
                    {unders.map((player) =>
                      <tr>
                        <td><Link onClick={this.trackClick} to={`/tools/players/${player._id._str}`}>{player.name}</Link></td>
                        <td>{player.adp[0][this.props.values.adpKey]}</td>
                        <td>{player.rankings[0][this.props.values.rankKey]}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-md-offset-3">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Win Now Bargains</h5>
                </div>
                <div className="ibox-content">
                  <table className="table">
                    <thead>
                      <th>Name</th>
                      <th>ADP</th>
                      <th>Redraft Rank</th>
                    </thead>
                    <tbody>
                      {nows.map((player) =>
                        <tr>
                          <td><Link onClick={this.trackClick} to={`/tools/players/${player._id._str}`}>{player.name}</Link></td>
                          <td>{player.adp[0][this.props.values.adpKey]}</td>
                          <td>{player.rankings[0][this.props.values.redraft]}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
  }
}

Dashboard.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
