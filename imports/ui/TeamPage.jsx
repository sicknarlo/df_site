import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import { Link, browserHistory } from 'react-router';
import $ from 'jquery';
import Select from 'react-select';
import { Button } from 'react-bootstrap';
import { Teams } from '../api/teams.js';

import PlayerRow from './PlayerRow.jsx';
import PageHeading from './PageHeading.jsx';
import DashboardLoggedOut from './DashboardLoggedOut.jsx';
import DashboardLoggedIn from './DashboardLoggedIn.jsx';
import TeamValueGraph from './TeamValueGraph.jsx';
import PositionWebGraph from './PositionWebGraph.jsx';
import TeamPortfolioGraph from './TeamPortfolioGraph.jsx';
import TeamPositionBreakdown from './TeamPositionBreakdown.jsx';

const currentMonthADP = 'may_16';
const previousMonthADP = 'apr_16';
const currentMonthValue = 'may_16_value';
const past6MonthsValue = [
  'nov_15_value',
  'dec_15_value',
  'jan_16_value',
  'feb_16_value',
  'mar_16_value',
  'apr_16_value',
  'may_16_value',
];
const past6MonthsADP = [
  'nov_15',
  'dec_15',
  'jan_16',
  'feb_16',
  'mar_16',
  'apr_16',
  'may_16',
];

const ageCalc = function(birthdate) {
  const bdate = birthdate ? birthdate : 680000000;
  const ageDifMs = Date.now() - bdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default class TeamPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionType: 'Trade',
      transactionAdd: [],
      transactionRemove: [],
      transactionShowCount: 5,
    };
    this.changeType = this.changeType.bind(this);
    this.handleAddtoAdd = this.handleAddtoAdd.bind(this);
    this.handleRemovefromAdd = this.handleRemovefromAdd.bind(this);
    this.handleAddtoRemove = this.handleAddtoRemove.bind(this);
    this.handleRemovefromRemove = this.handleRemovefromRemove.bind(this);
    this.addTransaction = this.addTransaction.bind(this);
    this.increaseTransactionCount = this.increaseTransactionCount.bind(this);
  }

  changeType(e) {
    this.setState({
      transactionType: e.target.value,
    });
  }

  addTransaction() {
    const newTrans = {};
    newTrans.add = this.state.transactionAdd;
    newTrans.remove = this.state.transactionRemove;
    newTrans.type = this.state.transactionType;
    newTrans.date = new Date();
    newTrans.valueMonth = currentMonthValue;
    const nextTransArray = this.props.team.transactions.concat([newTrans]);
    const dataWrapper = {
      team: this.props.team,
      nextTrans: nextTransArray,
      players: this.props.players,
    };

    Meteor.call('teams.addTransaction', dataWrapper);

    this.setState({
      transactionAdd: [],
      transactionRemove: [],
      transactionType: 'Trade',
    })
  }

  handleAddtoAdd(p) {
    if (!this.state.transactionAdd.indexOf(p.val) > -1) {
      const newRoster = this.state.transactionAdd;
      newRoster.push(p.val);
      this.setState({ transactionAdd: newRoster });
    }
  }

  handleRemovefromAdd(player) {
    const old1Roster = this.state.transactionAdd;
    const index = old1Roster.indexOf(player);
    if (index > -1) {
      const newRoster = old1Roster.splice(index, 1);
      this.setState({ transactionAdd: old1Roster });
    }
  }

  handleAddtoRemove(p) {
    if (!this.state.transactionRemove.indexOf(p.val) > -1) {
      const newRoster = this.state.transactionRemove;
      newRoster.push(p.val);
      this.setState({ transactionRemove: newRoster });
    }
  }

  handleRemovefromRemove(player) {
    const old2Roster = this.state.transactionRemove;
    const index = old2Roster.indexOf(player);
    if (index > -1) {
      const newRoster = old2Roster.splice(index, 1);
      this.setState({ transactionRemove: old2Roster });
    }
  }
  increaseTransactionCount() {
    this.setState({
      transactionShowCount: this.state.transactionShowCount + 5,
    })
  }
  render() {
    const team = this.props.team;
    let currentValue = 0;
    let lastValue = 0;
    let last3Value = 0;
    let last6Value = 0;
    const monthLast = past6MonthsValue[4];
    const month3 = past6MonthsValue[3];
    const month6 = past6MonthsValue[0];
    for (var i=0; i<team.players.length; i++) {
      currentValue += team.players[i][currentMonthValue];
      lastValue += team.players[i][monthLast];
      last3Value += team.players[i][month3];
      last6Value += team.players[i][month6];
    }

    const monthDiff1 = currentValue - lastValue;
    const monthDiff3 = currentValue - last3Value;
    const monthDiff6 = currentValue - last6Value;
    console.log(this.state.transactionAdd);

    const options = this.props.players.map(function(player) {
      return { val: player, label: player.name };
    });

    // const playerAlertMatches = this.props.newsAlerts.filter(function(a) {
    //   for (var i=0; i<team.players.length; i++) {
    //     return team.players[i]._id._str === a.player._id._str
    //   }
    // })
    //
    // console.log(playerAlertMatches);

    const monthDiff1Percent = (((100 * currentValue) / lastValue) - 100).toFixed(2);
    const monthDiff3Percent = (((100 * currentValue) / last3Value) - 100).toFixed(2);
    const monthDiff6Percent = (((100 * currentValue) / last6Value) - 100).toFixed(2);

    const sortedPlayers = team.players.sort(function(a, b) {
      if (a[currentMonthADP] > b[currentMonthADP]) {
        return 1;
      } else if (a[currentMonthADP] < b[currentMonthADP]) {
        return -1;
      }

      return 0;
    })

    const transactionsList = team.transactions.slice(0, this.state.transactionShowCount);
    const showMoreButton = team.transactions.length <= transactionsList.length
      ? <li onClick={this.setState()}
    return (
      <div>
        <PageHeading current={team.name} />
        <div className="wrapper wrapper-content">
          <div className="row">
            <div className="col-xs-12 text-center">
              <h1>Overview</h1>
            </div>
              <div className="col-sm-3">
                  <div className="ibox float-e-margins">
                      <div className="ibox-title">
                          <span className="label label-success pull-right">Total</span>
                          <h5>Value</h5>
                      </div>
                      <div className="ibox-content">
                          <h1 className="no-margins">{currentValue}</h1>
                      </div>
                  </div>
              </div>
              <div className="col-sm-3">
                  <div className="ibox float-e-margins">
                      <div className="ibox-title">
                          <h5>1 Month Change</h5>
                      </div>
                      <div className="ibox-content">
                          <h1 className="no-margins">{monthDiff1}</h1>

                          <div
                            className={classnames('stat-percent', 'font-bold', {
                              'text-navy': monthDiff1Percent > 0,
                              'text-danger': monthDiff1Percent < 0,
                              'text-info': monthDiff1Percent === 0,
                            })}>
                            {monthDiff1Percent}%
                            <i className={classnames('fa', {
                              'fa-level-up': monthDiff1Percent > 0,
                              'fa-level-down': monthDiff1Percent < 0,
                            })}></i>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="col-sm-3">
                  <div className="ibox float-e-margins">
                      <div className="ibox-title">
                          <h5>3 Month Change</h5>
                      </div>
                      <div className="ibox-content">
                      <h1 className="no-margins">{monthDiff3}</h1>

                      <div
                        className={classnames('stat-percent', 'font-bold', {
                          'text-navy': monthDiff3Percent > 0,
                          'text-danger': monthDiff3Percent < 0,
                          'text-info': monthDiff3Percent === 0,
                        })}>
                        {monthDiff3Percent}%
                        <i className={classnames('fa', {
                          'fa-level-up': monthDiff3Percent > 0,
                          'fa-level-down': monthDiff3Percent < 0,
                        })}></i>
                      </div>
                      </div>
                  </div>
              </div>
              <div className="col-sm-3">
                  <div className="ibox float-e-margins">
                      <div className="ibox-title">
                          <h5>6 Month Change</h5>
                      </div>
                      <div className="ibox-content">
                      <h1 className="no-margins">{monthDiff6}</h1>

                      <div
                        className={classnames('stat-percent', 'font-bold', {
                          'text-navy': monthDiff6Percent > 0,
                          'text-danger': monthDiff6Percent < 0,
                          'text-info': monthDiff6Percent === 0,
                        })}>
                        {monthDiff6Percent}%
                        <i className={classnames('fa', {
                          'fa-level-up': monthDiff6Percent > 0,
                          'fa-level-down': monthDiff6Percent < 0,
                        })}></i>
                      </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h2>Current Team Values</h2>
                </div>
                <div className="ibox-content">
                  <TeamValueGraph team={team} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 text-center">
              <h1>Team Portfolio</h1>
            </div>
            <div className="col-lg-12">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h2>Players</h2>
                </div>
                <div className="ibox-content">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>
                          Name
                        </th>
                        <th>
                          Position
                        </th>
                        <th className="hide-xs">
                          Age
                        </th>
                        <th>
                          ADP
                        </th>
                        <th className="hide-xs">
                          Trend
                        </th>
                        <th className="hide-xs">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPlayers && sortedPlayers.map((player, k) =>
                        <PlayerRow key={k} player={player} sortGrp="sortByADP" />
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <TeamPositionBreakdown team={team}/>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <h1 className="text-center">Transactions</h1>
            </div>
            <div className="col-md-6">
                <div className="ibox float-e-margins">
                    <div className="ibox-title">
                        <h2>Transaction History</h2>
                    </div>
                    <div className="ibox-content no-padding">
                      <ul className="list-group">
                        {transactionsList && transactionsList.map(function(t) {
                          return (
                            <li className="list-group-item">
                              <p>{t.date.toString()}</p>
                              <p>{t.type.toUpperCase()}</p>
                              <p><strong>ADD: </strong>{t.add.map((p) => <span className="greenText">{p.name} ({p[t.valueMonth]}) / </span>)};</p>
                              <p><strong>REMOVE: </strong>{t.remove.map((p) => <span className="redText">{p.name} (-{p[t.valueMonth]}) / </span>)};</p>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="ibox float-e-margins">
                    <div className="ibox-title">
                        <h2>Add Transaction</h2>
                    </div>
                    <div className="ibox-content">
                    <form className="form-horizontal">
                          <div className="form-group"><label className="col-lg-2 control-label">Type</label>
                              <div className="col-lg-10">
                                <select
                                  value={this.state.transactionType}
                                  ref="type"
                                  className="form-control"
                                  onChange={this.changeType}>
                                  <option>Trade</option>
                                  <option>Free Agency</option>
                                  <option>Drop</option>
                                  <option>Draft</option>
                                  <option>Other</option>
                                </select>
                              </div>
                          </div>
                          <div className="form-group"><label className="col-lg-2 control-label">Add</label>
                              <div className="col-lg-10">
                              {this.props.players &&
                                <Select
                                  name="form-field-name"
                                  value="one"
                                  options={options}
                                  onChange={this.handleAddtoAdd}
                                />
                              }
                              {this.state.transactionAdd.length > 0 &&
                                <table className="table">
                                  <thead>
                                  </thead>
                                  <tbody>
                                    {this.state.transactionAdd.length > 0 && this.state.transactionAdd.map((player) =>
                                      <tr className="removePlayerRow">
                                        <td><Link to={`/players/${player._id._str}`}>{player.name}</Link></td>
                                        <td>
                                          <div className="removePlayer" onClick={() => { this.handleRemovefromAdd(player); } }>
                                            <i className="fa fa-times-circle-o"></i>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              }
                              </div>
                          </div>
                          <div className="form-group"><label className="col-lg-2 control-label">Remove</label>
                              <div className="col-lg-10">
                              {this.props.players &&
                                <Select
                                  name="form-field-name"
                                  value="one"
                                  options={options}
                                  onChange={this.handleAddtoRemove}
                                />
                              }
                              {this.state.transactionRemove.length > 0 &&
                                <table className="table">
                                  <thead>
                                  </thead>
                                  <tbody>
                                    {this.state.transactionRemove.length > 0 && this.state.transactionRemove.map((player) =>
                                      <tr className="removePlayerRow">
                                        <td><Link to={`/players/${player._id._str}`}>{player.name}</Link></td>
                                        <td>
                                          <div className="removePlayer" onClick={() => { this.handleRemovefromRemove(player); } }>
                                            <i className="fa fa-times-circle-o"></i>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              }
                              </div>
                          </div>
                          <div className="row flexContainer justifyCenter">
                            <Button
                                className="tradeButton"
                                bsStyle="primary"
                                bsSize="large"
                                onClick={this.addTransaction}>
                                  <i className="fa fa-check"></i>&nbsp;
                                  Submit
                              </Button>
                          </div>
                      </form>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TeamPage.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
