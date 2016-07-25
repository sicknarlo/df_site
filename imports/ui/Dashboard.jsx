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
import Values from './ADPConst.jsx';

const currentMonthADP = Values.past6MonthsADP[5];
const currentMonthValue = Values.past6MonthsValue[5];

const ageCalc = function(birthdate) {
  const bdate = birthdate ? birthdate : 680000000;
  const ageDifMs = Date.now() - bdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default class Dashboard extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     rotoData: null,
  //   };
  // }
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

  render() {
    const filteredTrenders = this.props.players.filter((p) => p[currentMonthADP] < 151);
    const sortedTrenders = filteredTrenders.sort(function(a, b) {
      if (a.trend > b.trend) {
        return -1;
      }
      if (a.trend < b.trend) {
        return 1;
      }
      // a must be equal to b
        return 0;
    });
    const risers = sortedTrenders.slice(0, 10);
    const fallers = sortedTrenders.slice(sortedTrenders.length - 10, sortedTrenders.length).reverse();
    const dashboard = this.props.currentUser
    ? <DashboardLoggedIn
        players={this.props.players}
        newsAlerts={this.props.newsAlerts}
        currentUser={this.props.currentUser}
        teams={this.props.teams} />
    : <DashboardLoggedOut
        players={this.props.players}
        newsAlerts={this.props.newsAlerts} />
    return (
      <div>
        {dashboard}
        <div className="wrapper wrapper-content">
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
                      <th>Trend</th>
                    </thead>
                    <tbody>
                      {risers.map((player) =>
                        <tr>
                          <td><Link to={`/tools/players/${player._id._str}`}>{player.name}</Link></td>
                          <td>{player[currentMonthADP]}</td>
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
                    <th>Trend</th>
                  </thead>
                  <tbody>
                    {fallers.map((player) =>
                      <tr>
                        <td><Link to={`/tools/players/${player._id._str}`}>{player.name}</Link></td>
                        <td>{player[currentMonthADP]}</td>
                        <td>{player.trend}</td>
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
