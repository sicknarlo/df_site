import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Players } from '../api/players.js';
import classnames from 'classnames';
import PValues from './ADPConst.jsx';
import PlayerModal from './PlayerModal.jsx';
import Select from 'react-select';
import { browserHistory } from 'react-router';
import { Modal, Button, Popover, OverlayTrigger, Tab, Tabs } from 'react-bootstrap';
import 'icheck/skins/all.css';

function sortRank(rankName, playerPool) {
  const test = playerPool.slice().sort((a, b) => {
    if (a[rankName] > b[rankName]) {
      return 1;
    }
    if (a[rankName] < b[rankName]) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
  return test;
}
export default class DraftMate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draftLoaded: false,
      draftUpdating: false,
    };
    this.changeOwner = this.changeOwner.bind(this);
    this.setPick = this.setPick.bind(this);
    this.selectPlayer = this.selectPlayer.bind(this);
    this.toggleTeamViewer = this.toggleTeamViewer.bind(this);
    this.toggleRankingViewer = this.toggleRankingViewer.bind(this);
    this.openPlayerViewer = this.openPlayerViewer.bind(this);
    this.closePlayerViewer = this.closePlayerViewer.bind(this);
    this.selectPlayerInViewer = this.selectPlayerInViewer.bind(this);
    this.cleanInput = this.cleanInput.bind(this);
    this.cleanOutput = this.cleanOutput.bind(this);
  }

  componentWillMount() {
    const that = this;
    Meteor.call('drafts.get', this.props.params.draftMateID, function(error, result) {
      if (error) console.log('error', error);
      const state = result[0];
      state.draftLoaded = true;
      const serializedState = that.cleanInput(state);
      that.setState(serializedState);
    });
  }

  cleanInput(oldState) {
    const newState = oldState;
    newState.userRankings = newState.userRankings.map(
      id => this.props.players.find(player => player.id === id));
    newState.playerPool = newState.playerPool.map(
      id => this.props.players.find(player => player.id === id));
    return newState;
  }
  openPlayerViewer(p) {
    const playerName = p.target.text.substr(0, p.target.text.indexOf("|")-1) == "" ?
      p.target.text :
      p.target.text.substr(0, p.target.text.indexOf("|")-1);
    const player = this.props.players.find(p => p.name === playerName);
    this.setState({
      showPlayerViewer: true,
      playerInViewer: player,
      showRankingViewer: false,
    });
  }

  closePlayerViewer() {
    this.setState({
      showPlayerViewer: false,
      playerInViewer: null,
    });
  }

  toggleRankingViewer() {
    this.setState({
      showRankingViewer: !this.state.showRankingViewer,
    });
  }

  changeOwner(e) {
    const newPicks = this.state.picks;
    for (let i = 0; i < newPicks.length; i++) {
      const pick = newPicks[i];
      if (pick.draftPick === e.target.name) {
        pick.team = e.target.value;
        break;
      }
    }
    const data = {};
    data.state = this.state;
    data.state.picks = newPicks;
    data.id = this.props.params.draftMateID;
    const that = this;
    data.state = this.cleanOutput(data.state);
    this.setState({ draftUpdating: true });
    Meteor.call('drafts.update', data, (error, result) => {
      const serializedState = that.cleanInput(state);
      that.setState(serializedState);
    });
  }

  setPick(val) {
    this.setState({ selectedPlayer: val });
  }

  selectPlayerInViewer(e) {
    e.preventDefault();
    const player = this.state.playerPool.find(x => x == this.state.playerInViewer);
    const newPlayerPool = this.state.playerPool.filter(x => x != player);
    const expertRankings = this.state.expertRankings.map(er => {
      const wrapper = er;
      const newSet = er.players.filter(x => x !== player.id);
      wrapper.players = newSet;
      return wrapper;
    });
    const newPicks = this.state.picks;
    const currentPick = this.state.picks[this.state.pickNum - 1];
    currentPick.player = player;
    newPicks[this.state.pickNum - 1] = currentPick;
    const nextPick = this.state.picks[this.state.pickNum];
    const newSelectedPlayers = this.state.selectedPlayers;
    newSelectedPlayers.push(player);

    const data = {};
    data.state = this.state;
    data.state.playerPool = newPlayerPool;
    data.state.draftReady = true;
    data.state.draftStarted = true;
    data.state.picks = newPicks;
    data.state.pick = nextPick.draftPick;
    data.state.pickNum = this.state.pickNum + 1;
    data.state.selectedPlayer = null;
    data.state.selectedPlayers = newSelectedPlayers;
    data.state.showPlayerViewer = false;
    data.state.playerInViewer = null;
    data.state.expertRankings = expertRankings;
    data.id = this.props.params.draftMateID;
    const that = this;
    data.state = this.cleanOutput(data.state);
    this.setState({ draftUpdating: true });
    Meteor.call('drafts.update', data, (error, result) => {
      const serializedState = that.cleanInput(result[0]);
      that.setState(serializedState);
    });
  }

  cleanOutput(output) {
    const newData = output;
    newData.playerPool = output.playerPool.map(p => p.id);
    newData.userRankings = output.userRankings.map(p => p.id);
    return newData;
  }

  toggleTeamViewer() {
    this.setState({ showTeamViewer: !this.state.showTeamViewer });
  }

  selectPlayer(e) {
    e.preventDefault();
    const player = this.state.playerPool.find(x => x === this.state.selectedPlayer.val);
    const newPlayerPool = this.state.playerPool.filter(x => x !== player);
    const expertRankings = this.state.expertRankings.map(er => {
      const wrapper = er;
      const newSet = er.players.filter(x => x !== player.id);
      wrapper.players = newSet;
      return wrapper;
    });
    const newPicks = this.state.picks;
    const currentPick = this.state.picks[this.state.pickNum - 1];
    currentPick.player = player;
    newPicks[this.state.pickNum - 1] = currentPick;
    const nextPick = this.state.picks[this.state.pickNum];
    const newSelectedPlayers = this.state.selectedPlayers;
    newSelectedPlayers.push(player);

    const data = {};
    data.state = this.state;
    data.state.playerPool = newPlayerPool;
    data.state.draftReady = true;
    data.state.draftStarted = true;
    data.state.picks = newPicks;
    data.state.pick = nextPick.draftPick;
    data.state.pickNum = this.state.pickNum + 1;
    data.state.selectedPlayer = null;
    data.state.selectedPlayers = newSelectedPlayers;
    data.state.showPlayerViewer = false;
    data.state.playerInViewer = null;
    data.state.expertRankings = expertRankings;
    data.id = this.props.params.draftMateID;
    const that = this;
    data.state = this.cleanOutput(data.state);
    this.setState({ draftUpdating: true });
    Meteor.call('drafts.update', data, (error, result) => {
      const serializedState = that.cleanInput(result[0]);
      that.setState(serializedState);
    });
  }

  render() {
    if (!this.state.draftLoaded) return null;
    console.log(this.props.playerMap);
    const component = this;
    const teamOptions = [];
    for (let i = 0; i < this.state.draftOptions.teamCount; i++) {
      teamOptions.push(i + 1);
    }
    const currentTeam = this.state.picks[this.state.currentTeam - 1].team;
    const onDeck = this.state.picks[this.state.nextTeam - 1].team;
    const nextBest = this.state.expertRankings &&
      this.state.expertRankings.map(x => this.props.players.find(p => p.id === x.players[0]));
    const aCount = new Map([...new Set(nextBest)].map(
      x => [x, nextBest.filter(y => y === x).length]
    ));

    let rankingBpa = null;

    for (let i = 0; i < this.state.userRankings.length; i++) {
      if (!this.state.selectedPlayers.includes(this.state.userRankings[i])) {
        rankingBpa = this.state.userRankings[i];
        break;
      }
    }

    const sortedBest = new Map([...aCount.entries()].sort((a, b) => b[1] > a[1]));
    const expertPicks = [];
    sortedBest.forEach((count, player) =>
      expertPicks.push([player, Math.round((count / nextBest.length) * 100)]));
    const options = this.state.playerPool.map((player) => {
      return { val: player, label: player.name }
    });
    const selectPlayerInViewer = !this.state.selectedPlayers.includes(this.state.playerInViewer) ?
      <Button bsStyle="primary"
        onClick={this.selectPlayerInViewer}>
        Select Player
      </Button> :
      null;

    const playerModal = this.state.playerInViewer ?
    <PlayerModal
      player={this.state.playerInViewer}
      players={this.props.players}
      showPlayerViewer={this.state.showPlayerViewer}
      closePlayerViewer={this.closePlayerViewer}
      values={this.state.values}
      selectPlayerInViewer={this.selectPlayerInViewer}
      selectPlayerButton={selectPlayerInViewer}
      openPlayerViewer={this.openPlayerViewer}
    /> :
      null;

    let alertCount = 0;

    this.state.userRankings.forEach((player) => {
      if (
          (!this.state.selectedPlayers.includes(player) &&
          this.state.pickNum - player.adp[0][this.state.values.adpKey] > 1)) alertCount++;
    });

    const alertButton = alertCount > 0 ?
      <button type="button" className="btn btn-info m-r-sm">{alertCount}</button> :
      null;
    const draftboardAlert = alertCount > 0 ?
      <span className="label label-info draftBoardAlert">{alertCount}</span> :
        null;
    const mainclasses = classnames('wrapper wrapper-content animated fadeInRight draftMate',
      { 'sk-loading': this.state.updating });
    return (
      <div className={mainclasses}>
        <div className="sk-spinner sk-spinner-wave">
          <div cNamelass="sk-rect1"></div>
          <div className="sk-rect2"></div>
          <div className="sk-rect3"></div>
          <div className="sk-rect4"></div>
          <div className="sk-rect5"></div>
        </div>
        {playerModal}
        <Modal
          show={this.state.showRankingViewer}
          bsSize="lg"
          onHide={this.toggleRankingViewer}
          className="inmodal"
        >
          <Modal.Header closeButton><br />
          <i className="fa fa-line-chart modal-icon"></i><br />
            <Modal.Title>
              <h1>Draft Board</h1>
              <h3>Current Pick: {this.state.pickNum}</h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-lg-12 ibox float-e-margins">
                <div className="ibox-content">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>ADP</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.userRankings.map((player, i) => {
                        const classes = classnames({
                          strikeout: this.state.selectedPlayers.includes(player),
                        });
                        let valueLabel = null;
                        if (
                          (!this.state.selectedPlayers.includes(player) &&
                          this.state.pickNum - player.adp[0][this.props.values.adpKey] > 1 &&
                          this.state.pickNum - player.adp[0][this.props.values.adpKey] < 10)
                        ) valueLabel = (
                          <OverlayTrigger
                            trigger={['hover', 'focus', 'click']}
                            placement="bottom"
                            overlay={
                              <Popover title="Good Value Pick">
                                This player is available {this.state.pickNum - player.adp[0][this.props.values.adpKey]} spots after their ADP. This is a good value.
                              </Popover>
                            }
                          >
                            <span className="label label-info">GOOD VALUE</span>
                          </OverlayTrigger>
                        );

                        if (
                          (!this.state.selectedPlayers.includes(player) &&
                          this.state.pickNum - player.adp[0][this.props.values.adpKey] > 9)
                        ) valueLabel = (
                          <OverlayTrigger
                            trigger={['hover', 'focus', 'click']}
                            placement="bottom"
                            overlay={
                              <Popover title="Great Value Pick">
                                This player is available {this.state.pickNum - player.adp[0][this.props.values.adpKey]} spots after their rank or ADP. This is a great value.
                              </Popover>
                            }
                          >
                            <span className="label label-danger">GREAT VALUE</span>
                          </OverlayTrigger>
                        );

                        return (
                          <tr className={classes}>
                            <td><a onClick={this.openPlayerViewer}>{player.name}</a></td>
                            <td>{player.position}</td>
                            <td>{player.adp[0][this.props.values.adpKey]}</td>
                            <td>{valueLabel}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flexContainer spaceBetween">
            <Button onClick={this.toggleRankingViewer}>Close</Button>
          </Modal.Footer>
        </Modal>
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox float-e-margins">
              <div className="ibox-title">
                <h5>Draft</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-6">
                    <h2>On the Clock - {this.state.picks[this.state.pickNum - 1].team}</h2>
                    <h3>On Deck - {this.state.picks[this.state.pickNum].team}</h3>
                    <h2><a onClick={this.toggleRankingViewer}>Draft Board {alertButton}</a></h2>
                    <hr></hr>
                    <div className="row">
                      <div className="col-xs-12">
                        <div className="panel panel-default">
                          <div className="panel-heading">
                            Select the Next Pick
                          </div>
                          <div className="panel-body">
                            <form role="form" className="form-inline">
                              <div className="form-group compareSearch">
                                {this.state.playerPool &&
                                  <Select
                                    name="form-field-name"
                                    value={this.state.selectedPlayer}
                                    options={options}
                                    onChange={this.setPick}
                                  />
                                }
                              </div>
                              <button className="btn btn-primary" onClick={this.selectPlayer}>Submit Pick</button>
                            </form>
                            <div>
                              <h3>DynastyFFTools Best Player Available: <a onClick={this.openPlayerViewer}>{rankingBpa.name}</a></h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-12">
                        <div className="panel panel-default">
                          <div className="panel-heading">
                            Other Rankers
                          </div>
                          <div className="panel-body">
                            {expertPicks.map((pick) => {
                              const classes = classnames({
                                'progress-bar': true,
                                'progress-bar-info': pick[1] > 75,
                                'progress-bar-success': pick[1] < 76 && pick[1] > 19,
                                'progress-bar-warning': pick[1] < 20,
                              })
                              return (
                                <div>
                                  <div>
                                    <span><a onClick={this.openPlayerViewer}>{`${pick[0].name} | ${pick[0].position} | ${pick[0].team}`}</a></span>
                                    <small className="pull-right">{`${pick[1]}%`}</small>
                                  </div>
                                  <div className="progress progress-small">
                                    <div style={{ width: `${pick[1]}%` }} className={classes}></div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 draftContainer">
                    <Tabs defaultActiveKey={2} id="tabs" className="draftBoard">
                      <Tab eventKey={1} title="Draft">
                        <table className="table table-hover margin bottom">
                          <thead>
                            <tr>
                              <th style={{ width: '1%' }} className="text-center">Pick</th>
                              <th className="text-center">Player</th>
                              <th className="text-center">Team</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.picks.map((pick) => {
                              const classes = classnames({
                                info: pick.isUser,
                                success: pick.draftPick === this.state.pick,
                              });
                              return (
                                <tr key={pick.draftPick} className={classes}>
                                  <td className="text-center">{pick.draftPick}</td>
                                  <td> {pick.player && pick.player.name}</td>
                                  <td className="text-center small">
                                    <select
                                      name={pick.draftPick}
                                      value={pick.team}
                                      onChange={component.changeOwner}
                                    >
                                      {component.state.teams.map(t =>
                                        <option value={t.name}>{t.name}</option>
                                      )}
                                    </select>
                                  </td>
                                </tr>
                              );}
                            )}
                          </tbody>
                        </table>
                      </Tab>
                      <Tab
                        eventKey={2}
                        title={
                          <div>
                            Draft Board
                            {draftboardAlert}
                          </div>
                          }
                      >
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th></th>
                              <th>Position</th>
                              <th>ADP</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.userRankings.map((player) => {
                              const classes = classnames({
                                strikeout: this.state.selectedPlayers.includes(player),
                              });
                              let valueLabel = null;
                              if (
                                (!this.state.selectedPlayers.includes(player) &&
                                this.state.pickNum - player.adp[0][this.props.values.adpKey] > 1 &&
                                this.state.pickNum - player.adp[0][this.props.values.adpKey] < 10)
                              ) valueLabel = (
                                <OverlayTrigger
                                  trigger={['hover', 'focus', 'click']}
                                  placement="bottom"
                                  overlay={
                                    <Popover title="Good Value Pick">
                                      This player is available {this.state.pickNum - player.adp[0][this.props.values.adpKey]} spots after their rank or ADP. This is a good value.
                                    </Popover>
                                  }
                                >
                                  <span className="label label-info">GOOD VALUE</span>
                                </OverlayTrigger>
                              );

                              if (
                                (!this.state.selectedPlayers.includes(player) &&
                                this.state.pickNum - player.adp[0][this.props.values.adpKey] > 9)
                              ) valueLabel = (
                                <OverlayTrigger
                                  trigger={['hover', 'focus', 'click']}
                                  placement="bottom"
                                  overlay={
                                    <Popover title="Great Value Pick">
                                      This player is available {this.state.pickNum - player.adp[0][this.props.values.adpKey]} spots after their rank or ADP. This is a great value.
                                    </Popover>
                                  }
                                >
                                  <span className="label label-danger">GREAT VALUE</span>
                                </OverlayTrigger>
                              );
                              return (
                                <tr className={classes}>
                                  <td><a onClick={this.openPlayerViewer}>{player.name}</a></td>
                                  <td>{valueLabel}</td>
                                  <td>{player.position}</td>
                                  <td>{player.adp[0][this.props.values.adpKey]}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </Tab>
                    </Tabs>
                  </div>
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

DraftMate.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
