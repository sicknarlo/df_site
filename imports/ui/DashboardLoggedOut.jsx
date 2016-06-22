import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import $ from 'jquery';
import { Link } from 'react-router';

import PlayerRow from './PlayerRow.jsx';
import PageHeading from './PageHeading.jsx';

const currentMonthADP = 'may_16';
const currentMonthValue = 'may_16_value';

const ageCalc = function(birthdate) {
  const bdate = birthdate ? birthdate : 680000000;
  const ageDifMs = Date.now() - bdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default class DashboardLoggedOut extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     rotoData: null,
  //   };
  //
  //   this.componentDidMount = this.componentDidMount.bind(this);
  // }
  // componentDidMount() {
  //   const feed = 'http://www.rotoworld.com/rss/feed.aspx?sport=nfl&ftype=news&count=12&format=rss';
  //   let result = [];
  //   $.ajax({
  //     url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=13&callback=?&q=' + encodeURIComponent(feed),
  //     dataType: 'json',
  //     context: this,
  //     success(data) {
  //       if (data.responseData.feed && data.responseData.feed.entries) {
  //         result = data.responseData.feed.entries;
  //         this.setState({ rotoData: result });
  //       }
  //     },
  //   });
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
    return (
      <div>
        <div className="row  border-bottom white-bg dashboard-header">

          <div className="col-sm-12 text-center">
            <h1>You are not logged in.</h1>
            <h3><Link to="/login">Log In</Link> or <Link to="/signup">Sign Up</Link> to use the dashboard. It's free!</h3>
          </div>
        </div>
        <div className="wrapper wrapper-content">
          <div className="row">
            <div className="col-lg-6">
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
                          <td><Link to={`/players/${player._id._str}`}>{player.name}</Link></td>
                          <td>{player[currentMonthADP]}</td>
                          <td>{player.trend}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
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
                        <td><Link to={`/players/${player._id._str}`}>{player.name}</Link></td>
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

DashboardLoggedOut.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};


{/*<div className="ibox-content no-padding">
  <ul className="list-group">
    {this.props.newsAlerts && this.props.newsAlerts.map(function(item) {
      const playerLink = item.player
        ? (
          <Link className="text-info" to={`/players/${item.player._id._str}`}>
            @{item.player.name}&nbsp;
          </Link>)
        : <strong>General &nbsp;</strong>;
      return (
        <li className="list-group-item">
            <p>
              {playerLink}
              {$.parseHTML(item.content.content)[0].data}
            </p>
            <a href={item.content.link}><small className="block text-muted">Via Rotoworld</small></a>
        </li>
      )
    })}
</ul>
</div>*/}
