import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import PlayerModal from './PlayerModal.jsx';
import Select from 'react-select';
import { Link } from 'react-router';
import { Button, Pagination, Modal } from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import ADPGraph from './ADPGraph.jsx';


function formatDate(date) {
  const monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December',
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear().toString().substr(-2);

  return `${monthIndex + 1}/${day}/${year}`;
}

import 'icheck/skins/all.css';

export default class TradeSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tradesLoaded: false,
      trades: [],
      playersToFind: [],
      sliderValue: 75,
      useThreshold: true,
      step: 1,
      max: 100,
      min: 0,
      activePage: 1,
      items: 0,
    };

    this.logChange = this.logChange.bind(this);
    this.updateTrades = this.updateTrades.bind(this);
    this.changeSliderValue = this.changeSliderValue.bind(this);
    this.updateActivePage = this.updateActivePage.bind(this);
    this.findClosestPlayer = this.findClosestPlayer.bind(this);
    this.showResults = this.showResults.bind(this);
  }

  componentDidMount() {
    const filters = {};
    const that = this;
    filters.players = that.state.playersToFind;
    filters.threshhold = that.state.sliderValue;
    filters.useThreshold = that.state.useThreshold;
    Meteor.call('trades.get', filters, (error, result) => {
      if (error) console.log(error);
      if (result) {
        that.setState({
          trades: result,
          tradesLoaded: true,
          activePage: 1,
          items: Math.ceil(result.length / 10),
        });
      }
    });
  }

  logChange(e) {
    const newSet = this.state.playersToFind.push(e.val);
    this.setState({ playerstoFind: newSet });
  }

  updateTrades(e) {
    e.preventDefault();
    this.props.mixpanel.track('filter trade search');
    this.setState({ tradesLoaded: false });
    const filters = {};
    const that = this;
    filters.players = that.state.playersToFind;
    filters.threshhold = that.state.sliderValue;
    filters.useThreshold = that.state.useThreshold;
    Meteor.call('trades.get', filters, (error, result) => {
      if (error) console.log(error);
      if (result) {
        that.setState({
          trades: result,
          tradesLoaded: true,
          activePage: 1,
          items: Math.ceil(result.length / 10),
        });
      }
    });
  }

  changeSliderValue(e) {
    this.setState({ sliderValue: e.target.value });
  }

  updateActivePage(e) {
    this.setState({ activePage: e });
  }

  removePlayerFromFind(player) {
    const newState = { playersToFind: this.state.playersToFind };
    const index = newState.playersToFind.indexOf(player);
    if (index > -1) {
      newState.playersToFind.splice(index, 1);
      this.setState(newState);
    }
  }

  findClosestPlayer(val) {
    let curr = this.props.players[0];
    this.props.players.forEach((player) => {
      if (Math.abs(val - player.adp[0][this.props.values.valueKey]) < Math.abs(val - curr.adp[0][this.props.values.valueKey])) {
        curr = player;
      }
    })

    return curr;
  }

  showResults(e) {
    const savedTrade = this.state.trades[parseInt(e.target.dataset.value)];
    this.props.mixpanel.track('open trade details');
    const that = this;
    const trade = {};
    trade.team1 = [];
    trade.team2 = [];
    let team1ValueSent = 0;
    savedTrade.team1.forEach((p) => {
      const player = this.props.players.find(x => x._id._str === p);
      if (player) {
        team1ValueSent += player.adp[0][this.props.values.valueKey];
        trade.team1.push(player);
      }
    });
    let team2ValueSent = 0;
    savedTrade.team2.forEach((p) => {
      const player = this.props.players.find(x => x._id._str === p);
      if (player) {
        team2ValueSent += player.adp[0][this.props.values.valueKey];
        trade.team2.push(player);
      }
    });
    const fairness = Math.round((Math.min(team1ValueSent, team2ValueSent) / Math.max(team1ValueSent, team2ValueSent)) * 100);
    trade.fairnessText = `${fairness}% Fair`;
    trade.degree = null;
    if (fairness > 89) {
      trade.degree = <span className='greenText'>Slightly</span>;
    } else if (fairness > 79) {
      trade.degree = <span className='yellowText'>Moderately</span>;
    } else {
      trade.degree = <span className = 'redText'>Heavily</span>
    }
    trade.winningTeam = trade.team1ValueGained > trade.team2ValueGained ? 'Team 1' : 'Team 2';
    trade.fairnessStatement = <div className="fairnessStatement">
                                This trade is {trade.degree} in favor of {trade.winningTeam}
                              </div>;
    trade.closestPlayer = this.findClosestPlayer(Math.abs(trade.team1ValueGained));
    trade.closestPlayerString = trade.closestPlayer
      ? (<div>
          <h2>The difference is equal to <Link to={`/tools/players/${trade.closestPlayer._id._str}`}>{trade.closestPlayer.name}</Link> with an ADP of <strong>{trade.closestPlayer.adp[0][this.props.values.adpKey]}</strong></h2>
        </div>
        )
      : null;
    trade.team1ValueGained = team2ValueSent - team1ValueSent;
    trade.team2ValueGained = team1ValueSent - team2ValueSent;
    trade.winningTeam = trade.team1ValueGained > trade.team2ValueGained ? 1 : 2;
    trade.closestPlayer = this.findClosestPlayer(Math.abs(trade.team1ValueGained))._id._str;
    trade.fairness = Math.round((Math.min(team1ValueSent, team2ValueSent) / Math.max(team1ValueSent, team2ValueSent)) * 100);
    that.setState({ showResults: true, trade })
  }

  render() {
    const mainclasses = classnames('wrapper wrapper-content animated fadeInRight draftMate', {
      'sk-loading': !this.state.tradesLoaded,
    });
    const options = this.props.players.map(function(player) {
      return { val: player, label: player.name };
    });

    const tradeSubset = this.state.trades.slice().slice(
      (this.state.activePage - 1) * 10,
      ((this.state.activePage - 1) * 10) + 10
    );

    return (
      <div className={mainclasses}>
        <div className="sk-spinner sk-spinner-wave">
          <div cNamelass="sk-rect1" />
          <div className="sk-rect2" />
          <div className="sk-rect3" />
          <div className="sk-rect4" />
          <div className="sk-rect5" />
        </div>
        {this.state.trade &&
        <Modal
          show={this.state.showResults}
          bsSize="lg"
          onHide={() => this.setState({ showResults: false, trade: null })}
          className="inmodal"
        >
          <Modal.Header closeButton><br />
          <i className="fa fa-line-chart modal-icon"></i><br />
            <Modal.Title>
              Results
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6 calcSection">
                <div className="flexContainer spaceBetween header4">
                  <div>Team 1 Gains:</div>
                  <div>{this.state.trade.team1ValueGained}</div>
                </div>
                    {this.state.trade.team2.map((player) =>
                      <div className="calcResultRow">
                        <div>
                          <Link to={`/tools/players/${player._id._str}`}>{player.name}</Link>
                        </div>
                        <div>
                          {player.adp[0][this.props.values.valueKey]}
                        </div>
                      </div>
                    )}
              </div>
              <div className="col-md-6 calcSection">
                <div className="flexContainer spaceBetween header4">
                  <div>
                    Team 2 Gains:
                  </div>
                  <div>
                    {this.state.trade.team2ValueGained}
                  </div>
                </div>
                    {this.state.trade.team1.map((player) =>
                      <div className="calcResultRow">
                        <div>
                          <Link to={`/tools/players/${player._id._str}`}>{player.name}</Link>
                        </div>
                        <div>
                          {player.adp[0][this.props.values.valueKey]}
                        </div>
                      </div>
                    )}
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-lg-12">
                <div className="ibox">
                  <div className="ibox-content">
                    <h3>{this.state.trade.fairnessStatement}</h3>
                    <h2>{this.state.trade.fairness}% Fair</h2>
                    <div className="progress progress-mini">
                      <div
                        style={{ width: `${this.state.trade.fairness}%` }}
                        className={classnames('progress-bar', {
                          greenBackground: this.state.trade.fairness > 89,
                          yellowBackground: this.state.trade.fairness < 90 && this.state.trade.fairness > 79,
                          redBackground: this.state.trade.fairness < 80,
                        })}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <ADPGraph players={this.state.trade.team1.concat(this.state.trade.team2)} values={this.props.values} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="ibox">
                  <div className="ibox-content">
                    {this.state.trade.closestPlayerString}
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flexContainer spaceBetween">
            <Button onClick={() => this.setState({ showResults: false, trade: null, })}>Close</Button>
          </Modal.Footer>
        </Modal>
        }
        <div className="row">
          <div className="col-lg-12">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Trade Database</h5>
                </div>
                <div className="ibox-content">
                  <div className="row">
                    <div className="col-lg-12">
                      <h4>Need help getting those trade juices flowing? Want to see what offers other people are making or entertaining? Search our trade database to get you started!</h4>
                    </div>
                    <hr />
                  </div>
                  <div className="row m-b-sm m-t-sm">
                    <form className="form-horizontal">
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Players</label>
                        <div className="col-sm-10">
                          <div className="form-group compareSearch">
                          {this.props.players &&
                            <Select
                              name="form-field-name"
                              value="one"
                              className="player-select-field"
                              options={options}
                              onChange={this.logChange}
                            />
                          }
                          </div>
                          {this.state.playersToFind.length > 0 &&
                            <table className="table">
                              <thead>
                              </thead>
                              <tbody>
                                {this.state.playersToFind && this.state.playersToFind.length > 0 && this.state.playersToFind.map((player) =>
                                  <tr className="removePlayerRow">
                                    <td><Link to={`/tools/players/${player._id._str}`}>{player.name}</Link></td>
                                    <td>
                                      <div className="removePlayer" onClick={() => { this.removePlayerFromFind(player); } }>
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
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Min Score</label>
                        <div className="col-sm-10">
                          <input
                            className="form-control"
                            value={this.state.sliderValue}
                            onChange={this.changeSliderValue}
                            type="number"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-4 col-sm-offset-2">
                          <button
                            type="button"
                            id="loading-example-btn"
                            className="btn btn-primary btn-sm"
                            onClick={this.updateTrades}
                          >
                            <i className="fa fa-refresh" /> Update
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="col-xs-12 text-center">
                    <Pagination
                      bsSize="small"
                      items={this.state.items}
                      activePage={this.state.activePage}
                      onSelect={this.updateActivePage}
                    />
                  </div>
                  <div className="project-list">
                    {this.state.trades && this.state.trades.length === 0 &&
                      (<div className="col-lg-12"><h1>No Results</h1></div>)
                    }
                    <table className="table table-hover">
                      <tbody>
                        {tradeSubset && tradeSubset.map((trade, i) => {
                          return (
                            <tr>
                              <td className="project-status" >
                                <a href="#" data-value={i} onClick={this.showResults}>Details</a><br />
                                <small>{formatDate(trade.date)}</small>
                              </td>
                              <td className="project-title">
                                <strong>Team 1 Gives</strong><br />
                                <small>{trade.team1.map(p => (
                                  <div>
                                    {this.props.players.find(x => x._id._str === p).name}
                                  </div>
                                  )
                                  )}
                                </small>
                              </td>
                              <td className="project-title">
                                <strong>Team 2 Gives</strong><br />
                                <small>{trade.team2.map(p => (
                                  <div>
                                    {this.props.players.find(x => x._id._str === p).name}
                                  </div>
                                )
                                )}
                              </small>
                              </td>
                              <td className="project-completion">
                                <small>{`${trade.fairness}% Fair`}</small><br />
                                <small>Favors Team {trade.winningTeam}</small>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="col-xs-12 text-center">
                    <Pagination
                      bsSize="small"
                      items={this.state.items}
                      activePage={this.state.activePage}
                      onSelect={this.updateActivePage}
                    />
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
    return null;
  }
}

TradeSearch.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
