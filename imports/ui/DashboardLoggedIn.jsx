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
  constructor(props) {
    super(props);
  }
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
    const user = this.props.currentUser;
    return (
      <div>
        <div className="row  border-bottom white-bg dashboard-header">
          <div className="col-sm-3">
            <h2>Welcome {user.username}</h2>
          </div>
        </div>
        <div className="ibox">
            <div className="ibox-title">
                <h5>Your Teams</h5>
                <div className="ibox-tools">
                    <Link to='/createteam' className="btn btn-primary btn-xs">Create new team</Link>
                </div>
            </div>
            <div className="ibox-content">
                <div className="project-list">
                    <table className="table table-hover">
                        <tbody>
                          {this.props.teams && this.props.teams.map(function(t) {
                            const playerCount = t.players.length;
                            const isPPR = t.isPPR ? <span className='label label-warning'>PPR</span> : null;
                            const isIDP = t.isIDP ? <span className='label label-info'>IDP</span> : null;
                            const is2QB = t.is2QB ? <span className='label label-success'>2QB</span> : null;
                            return (
                            <Link to={`/teams/${t._id}`}>
                              <tr>
                                <td>
                                    <Link to={`/teams/${t._id}`}>{t.name}</Link>
                                    <br />
                                    <small>{t.teamCount} teams</small>
                                </td>
                                <td>
                                    {playerCount} players
                                </td>
                                <td>
                                    &nbsp;
                                    {isPPR}&nbsp;
                                    {isIDP}&nbsp;
                                    {is2QB}&nbsp;
                                </td>
                              </tr>
                            </Link>
                          )})}
                        </tbody>
                    </table>
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
