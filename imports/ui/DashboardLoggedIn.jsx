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

export default class DashboardLoggedIn extends Component {
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
    const user = this.props.currentUser
    return (
      <div>
        <div className="row  border-bottom white-bg dashboard-header">
          <div className="col-sm-3">
            <h2>Welcome {user.username}</h2>
            <small>You have 42 messages and 6 notifications.</small>
          </div>
          <div className="col-sm-6">
            <div className="flot-chart dashboard-chart">
              <div className="flot-chart-content" id="flot-dashboard-chart"></div>
            </div>
            <div className="row text-left">
              <div className="col-xs-4">
                <div className=" m-l-md">
                  <span className="h4 font-bold m-t block">$ 406,100</span>
                  <small className="text-muted m-b block">Sales marketing report</small>
                </div>
              </div>
              <div className="col-xs-4">
              <span className="h4 font-bold m-t block">$ 150,401</span>
                  <small className="text-muted m-b block">Annual sales revenue</small>
              </div>
              <div className="col-xs-4">
                <span className="h4 font-bold m-t block">$ 16,822</span>
                <small className="text-muted m-b block">Half-year revenue margin</small>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="statistic-box">
              <h4>
                  Project Beta progress
              </h4>

              <p>
                  You have two project with not compleated task.
              </p>

              <div className="row text-center">
                <div className="col-lg-6">
                  <canvas id="polarChart" width="80" height="80"></canvas>
                  <h5>Kolter</h5>
                </div>
                <div className="col-lg-6">
                  <canvas id="doughnutChart" width="78" height="78"></canvas>
                  <h5>Maxtor</h5>
                </div>
              </div>
              <div className="m-t">
                <small>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DashboardLoggedIn.propTypes = {
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
