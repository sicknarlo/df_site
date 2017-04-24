import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import PlayerModal from './PlayerModal.jsx';
import Select from 'react-select';
import { Modal, Button, Popover, OverlayTrigger, Tab, Tabs } from 'react-bootstrap';
import 'icheck/skins/all.css';

export default class DraftMate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draftLoaded: false,
      draftUpdating: false,
      teamInViewer: 0,
      suggestionType: 'expert',
    };
    this.changeOwner = this.changeOwner.bind(this);
    this.changeTeamName = this.changeTeamName.bind(this);
    this.setPick = this.setPick.bind(this);
    this.simulatePick = this.simulatePick.bind(this);
    this.selectPlayer = this.selectPlayer.bind(this);
    this.toggleTeamViewer = this.toggleTeamViewer.bind(this);
    this.toggleRankingViewer = this.toggleRankingViewer.bind(this);
    this.openPlayerViewer = this.openPlayerViewer.bind(this);
    this.closePlayerViewer = this.closePlayerViewer.bind(this);
    this.selectPlayerInViewer = this.selectPlayerInViewer.bind(this);
    this.updateTeamInViewer = this.updateTeamInViewer.bind(this);
    this.updateSuggestionType = this.updateSuggestionType.bind(this);
    this.selectPlayerFromList = this.selectPlayerFromList.bind(this);
    this.saveTeams = this.saveTeams.bind(this);
  }

  componentWillMount() {
    const that = this;
    Meteor.call('drafts.get', this.props.params.draftMateID, (error, result) => {
      const state = result[0];
      state.draftLoaded = true;
      that.setState(state);
    });
  }

  componentDidMount() {
    if (this.state.pickNum > this.state.picks.length) alert('This draft is complete');
  }

  openPlayerViewer(p) {
    const player = this.props.playerMap.get(parseInt(p.target.dataset.value, 10));
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

  simulatePick(e) {
    e.preventDefault();
    let adp = 'adp';
    if (this.state.draftOptions.format === 'rookie') {
      adp = 'rookieAdp';
    }
    const nextBest = this.state.expertRankings &&
      this.state.expertRankings.map(x => this.props.playerMap.get(x.players[0]));
    const aCount = new Map([...new Set(nextBest)].map(
      x => [x, nextBest.filter(y => y === x).length]
    ));

    const sortedBest = new Map([...aCount.entries()].sort((a, b) => b[1] > a[1]));
    const expertPicks = [];
    sortedBest.forEach((count, player) => {
      if (player) expertPicks.push([player, Math.round((count / nextBest.length) * 100)]);
    });

    let player = null;
    if (expertPicks.length) {
      let current = 0;
      const ranges = expertPicks.map(x => {
        const val = current + x[1];
        current += x[1];
        return [x, val];
      })
      const roll = Math.random() * 100;
      ranges.some(x => {
        if (roll < x[1]) {
          player = x[0][0];
          return true;
        }
      });
      if (!player) player = expertPicks[0][0];
    } else {
      player = this.props.playerMap.get(this.state.playerPool[0]);
    }

    const newPlayerPool = this.state.playerPool.filter(x => x !== player.id);
    const expertRankings = this.state.expertRankings.map(er => {
      const wrapper = er;
      const newSet = er.players.filter(x => x !== player.id);
      wrapper.players = newSet;
      return wrapper;
    });
    const newPicks = this.state.picks;
    const currentPick = this.state.picks[this.state.pickNum - 1];
    currentPick.player = player.id;
    currentPick.vsAdp = player[adp] ?
      this.state.pickNum - player[adp][0][this.props.values.adpKey] :
      0;
    newPicks[this.state.pickNum - 1] = currentPick;
    const nextPick = this.state.picks[this.state.pickNum];
    const newSelectedPlayers = this.state.selectedPlayers;
    newSelectedPlayers.push(player.id);
    const data = {};
    data.draftComplete = this.state.nextPick ? false : true;
    data.state = this.state;
    data.state.playerPool = newPlayerPool;
    data.state.draftReady = true;
    data.state.draftStarted = true;
    data.state.picks = newPicks;
    data.state.pick = nextPick ? nextPick.draftPick : null;
    data.state.pickNum = this.state.pickNum + 1;
    data.state.selectedPlayer = null;
    data.state.selectedPlayers = newSelectedPlayers;
    data.state.showPlayerViewer = false;
    data.state.playerInViewer = null;
    data.state.expertRankings = expertRankings;
    data.id = this.props.params.draftMateID;
    const that = this;
    this.setState({ draftUpdating: true });
    Meteor.call('drafts.update', data, (error, result) => {
      that.setState(result[0]);
      if (that.state.pickNum > that.state.picks.length) alert('This draft is complete');
    });

  }

  toggleRankingViewer() {
    this.setState({
      showRankingViewer: !this.state.showRankingViewer,
    });
  }

  changeTeamName(e) {
    const teams = this.state.teams
    teams.find(x => x.id === this.state.teamInViewer).name = e.target.value;
    this.setState({ tempTeams: teams });
  }

  saveTeams() {
    const data = {};
    data.state = this.state;
    data.teams = this.state.tempTeams;
    data.tempTeams = null;
    data.id = this.props.params.draftMateID;
    const that = this;
    this.setState({ draftUpdating: true });
    Meteor.call('drafts.update', data, (error, result) => {
      that.setState(result[0]);
    });
    alert('Teams Saved');
  }

  updateTeamInViewer(e) {
    this.setState({ teamInViewer: parseInt(e.target.value) });
  }

  updateSuggestionType(e) {
    this.setState({ suggestionType: e.target.value });
  }

  changeOwner(e) {
    const newPicks = this.state.picks;
    const targetNum = parseInt(e.target.value);
    for (let i = 0; i < newPicks.length; i++) {
      const pick = newPicks[i];
      if (pick.draftPick === e.target.name) {
        pick.team = targetNum;
        break;
      }
    }
    const data = {};
    data.state = this.state;
    data.state.picks = newPicks;
    data.id = this.props.params.draftMateID;
    const that = this;
    this.setState({ draftUpdating: true });
    Meteor.call('drafts.update', data, (error, result) => {
      that.setState(result[0]);
      if (that.state.pickNum > that.state.picks.length) alert('This draft is complete');
    });
  }

  setPick(val) {
    this.setState({ selectedPlayer: val });
  }

  selectPlayerInViewer(e) {
    e.preventDefault();
    let adp = 'adp';
    if (this.state.draftOptions.format === 'rookie') {
      adp = 'rookieAdp';
    }
    const player = this.state.playerInViewer;
    const newPlayerPool = this.state.playerPool.filter(x => x !== player.id);
    const expertRankings = this.state.expertRankings.map(er => {
      const wrapper = er;
      const newSet = er.players.filter(x => x !== player.id);
      wrapper.players = newSet;
      return wrapper;
    });
    const newPicks = this.state.picks;
    const currentPick = this.state.picks[this.state.pickNum - 1];
    currentPick.player = player.id;
    currentPick.vsAdp = player[adp] ?
      this.state.pickNum - player[adp][0][this.props.values.adpKey] :
      0;
    newPicks[this.state.pickNum - 1] = currentPick;
    const nextPick = this.state.picks[this.state.pickNum];
    const newSelectedPlayers = this.state.selectedPlayers;
    newSelectedPlayers.push(player.id);
    const data = {};
    data.draftComplete = this.state.nextPick ? false : true;
    data.state = this.state;
    data.state.playerPool = newPlayerPool;
    data.state.draftReady = true;
    data.state.draftStarted = true;
    data.state.picks = newPicks;
    data.state.pick = nextPick ? nextPick.draftPick : null;
    data.state.pickNum = this.state.pickNum + 1;
    data.state.selectedPlayer = null;
    data.state.selectedPlayers = newSelectedPlayers;
    data.state.showPlayerViewer = false;
    data.state.playerInViewer = null;
    data.state.expertRankings = expertRankings;
    data.id = this.props.params.draftMateID;
    const that = this;
    this.setState({ draftUpdating: true });
    Meteor.call('drafts.update', data, (error, result) => {
      that.setState(result[0]);
      if (that.state.pickNum > that.state.picks.length) alert('This draft is complete');
    });
  }

  toggleTeamViewer() {
    this.setState({ showTeamViewer: !this.state.showTeamViewer });
  }

  selectPlayerFromList(e) {
    e.preventDefault();
    let adp = 'adp';
    if (this.state.draftOptions.format === 'rookie') {
      adp = 'rookieAdp';
    }
    const player = this.props.playerMap.get(parseInt(e.target.dataset.value));
    const newPlayerPool = this.state.playerPool.filter(x => x !== player.id);
    const expertRankings = this.state.expertRankings.map(er => {
      const wrapper = er;
      const newSet = er.players.filter(x => x !== player.id);
      wrapper.players = newSet;
      return wrapper;
    });
    const newPicks = this.state.picks;
    const currentPick = this.state.picks[this.state.pickNum - 1];
    currentPick.player = player.id;
    currentPick.vsAdp = player[adp] ?
      this.state.pickNum - player[adp][0][this.state.values.adpKey] :
      0;
    newPicks[this.state.pickNum - 1] = currentPick;
    const nextPick = this.state.picks[this.state.pickNum];
    const newSelectedPlayers = this.state.selectedPlayers;
    newSelectedPlayers.push(player.id);
    const data = {};
    data.state = this.state;
    data.draftComplete = this.state.nextPick ? false : true;
    data.state.playerPool = newPlayerPool;
    data.state.draftReady = true;
    data.state.draftStarted = true;
    data.state.picks = newPicks;
    data.state.pick = nextPick ? nextPick.draftPick : null;
    data.state.pickNum = this.state.pickNum + 1;
    data.state.selectedPlayer = null;
    data.state.selectedPlayers = newSelectedPlayers;
    data.state.showPlayerViewer = false;
    data.state.playerInViewer = null;
    data.state.expertRankings = expertRankings;
    data.id = this.props.params.draftMateID;
    const that = this;
    this.setState({ draftUpdating: true });
    Meteor.call('drafts.update', data, (error, result) => {
      that.setState(result[0]);
      if (that.state.pickNum > that.state.picks.length) alert('This draft is complete');
    });
  }

  selectPlayer(e) {
    e.preventDefault();
    let adp = 'adp';
    if (this.state.draftOptions.format === 'rookie') {
      adp = 'rookieAdp';
    }
    const player = this.props.playerMap.get(this.state.selectedPlayer.val);
    const newPlayerPool = this.state.playerPool.filter(x => x !== player.id);
    const expertRankings = this.state.expertRankings.map(er => {
      const wrapper = er;
      const newSet = er.players.filter(x => x !== player.id);
      wrapper.players = newSet;
      return wrapper;
    });
    const newPicks = this.state.picks;
    const currentPick = this.state.picks[this.state.pickNum - 1];
    currentPick.player = player.id;
    p = this.state.pickNum - player[adp][0][this.state.values.adpKey];
    newPicks[this.state.pickNum - 1] = currentPick;
    const nextPick = this.state.picks[this.state.pickNum];
    const newSelectedPlayers = this.state.selectedPlayers;
    newSelectedPlayers.push(player.id);
    const data = {};
    data.state = this.state;
    data.draftComplete = this.state.nextPick ? false : true;
    data.state.playerPool = newPlayerPool;
    data.state.draftReady = true;
    data.state.draftStarted = true;
    data.state.picks = newPicks;
    data.state.pick = nextPick ? nextPick.draftPick : null;
    data.state.pickNum = this.state.pickNum + 1;
    data.state.selectedPlayer = null;
    data.state.selectedPlayers = newSelectedPlayers;
    data.state.showPlayerViewer = false;
    data.state.playerInViewer = null;
    data.state.expertRankings = expertRankings;
    data.id = this.props.params.draftMateID;
    const that = this;
    this.setState({ draftUpdating: true });
    Meteor.call('drafts.update', data, (error, result) => {
      that.setState(result[0]);
      if (that.state.pickNum > that.state.picks.length) alert('This draft is complete');
    });
  }

  render() {
    if (!this.state.draftLoaded) return null;
    const component = this;
    const teamOptions = [];
    for (let i = 0; i < this.state.draftOptions.teamCount; i++) {
      teamOptions.push(i + 1);
    }
    const nextBest = this.state.expertRankings &&
      this.state.expertRankings.map(x => this.props.playerMap.get(x.players[0]));
    const aCount = new Map([...new Set(nextBest)].map(
      x => [x, nextBest.filter(y => y === x).length]
    ));

    let rankingBpa = null;

    for (let i = 0; i < this.state.userRankings.length; i++) {
      if (!this.state.selectedPlayers.includes(this.state.userRankings[i])) {
        rankingBpa = this.props.playerMap.get(this.state.userRankings[i]);
        break;
      }
    }

    const sortedBest = new Map([...aCount.entries()].sort((a, b) => b[1] > a[1]));
    const expertPicks = [];
    sortedBest.forEach((count, player) => {
      if (player) expertPicks.push([player, Math.round((count / nextBest.length) * 100)]);
    });
    const options = this.state.playerPool.map((playerId) => {
      const p = this.props.playerMap.get(playerId);
      return { val: p.id, label: p.name }
    });
    const selectPlayerInViewer =
      this.state.playerInViewer &&
      !this.state.selectedPlayers.includes(this.state.playerInViewer.id) &&
      this.state.playerPool.includes(this.state.playerInViewer.id) ?
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
        isRookie={this.state.draftOptions.format === 'rookie'}
      /> :
        null;

    let alertCount = 0;

    let adp = 'adp';
    if (this.state.draftOptions.format === 'rookie') {
      adp = 'rookieAdp';
    }

    this.state.userRankings.forEach((playerId) => {
      if (
          (
            !this.state.selectedPlayers.includes(playerId) &&
            this.props.playerMap.get(playerId)[adp] &&
            this.state.pickNum - this.props.playerMap.get(playerId)[adp][0][this.state.values.adpKey] > 1)) alertCount++;
    });

    const alertButton = alertCount > 0 ?
      <button type="button" className="btn btn-info m-r-sm">{alertCount}</button> :
      null;
    const draftboardAlert = alertCount > 0 ?
      <span className="label label-info draftBoardAlert">{alertCount}</span> :
        null;
    const mainclasses = classnames('wrapper wrapper-content animated fadeInRight draftMate',
      { 'sk-loading': this.state.updating });

    const teams = this.state.teams;
    const teamMap = new Map(teams.map(team => [team.id, team]));

    const teamPicks = this.state.picks.filter(pick => pick.team === this.state.teamInViewer);
    let teamValue = 0;
    teamPicks.forEach(x => { if (x.vsAdp) teamValue += x.vsAdp; });

    let pickSuggestionView = null;

    if (this.state.suggestionType === 'expert') {
      pickSuggestionView = (
        <table className="table table-hover">
          <tbody>
            {expertPicks.map(pick => {
              const player = pick[0];
              const classes = classnames({
                'progress-bar': true,
                'progress-bar-info': pick[1] > 75,
                'progress-bar-success': pick[1] < 76 && pick[1] > 19,
                'progress-bar-warning': pick[1] < 20,
              });
              return (
                <tr>
                <td className="project-title" data-value={player} onClick={this.openPlayerViewer}>
                  <strong>{player.name}</strong>
                  <br />
                <small>
                  {player.team} | {player.position}
                </small>
              </td>
              <td>
                <small>Experts Agree: {`${pick[1]}%`}</small>
                <div className="progress progress-mini">
                  <div style={{ width: `${pick[1]}%` }} className={classes}></div>
                </div>
              </td>
              <td className="text-center">
                ADP
                <br />
                <small>
                  {
                    player[adp] &&
                    player[adp][0] &&
                    player[adp][0][this.state.values.adpKey]
                  }
                </small>
              </td>
              <td className="text-center">
                RAR
                <br />
                  <small>
                    {
                      player.rankings &&
                      player.rankings[0][this.state.values.rankKey]
                    }
                  </small>
              </td>
              <td className="project-actions">
                <a
                  href="#"
                  className="btn btn-primary btn-sm"
                  data-value={player.id}
                  onClick={this.selectPlayerFromList}
                >
                Select
                </a>
              </td>
            </tr>
          );
            })}
        </tbody>
      </table>
      );
    } else if (this.state.suggestionType === 'topPlayersRank') {
      const tops = ['QB', 'WR', 'RB', 'TE'];
      const playerMap = this.props.playerMap;
      const playerPool = this.state.playerPool;
      let topPlayersRank = tops.map(position => {
        let player = null;
        playerPool.some(x => {
          const p = playerMap.get(x);
          if (p.position === position) {
            player = p;
            return true;
          }
        });
        return player;
      });
      topPlayersRank = topPlayersRank.filter(x => x !== null);
      pickSuggestionView = (
        <table className="table table-hover">
          <tbody>
            {topPlayersRank.map(player =>
              <tr>
                <td className="project-title">
                  <strong>{player.name}</strong>
                  <br />
                <small>
                  {player.team} | {player.position}
                </small>
              </td>
              <td className="text-center">
                ADP vs Pick
                <br />
                <small>
                  {player[adp] && (this.state.pickNum - player[adp][0][this.state.values.adpKey]).toFixed(2)}
                </small>
              </td>
              <td className="text-center">
                ADP
                <br />
                <small>
                  {
                    player[adp] &&
                    player[adp][0] &&
                    player[adp][0][this.state.values.adpKey]
                  }
                </small>
              </td>
              <td className="text-center">
                RAR
                <br />
                  <small>
                    {
                      player.rankings &&
                      player.rankings[0][this.state.values.rankKey]
                    }
                  </small>
              </td>
              <td className="project-actions">
                <a
                  href="#"
                  className="btn btn-primary btn-sm"
                  data-value={player.id}
                  onClick={this.selectPlayerFromList}
                >
                Select
                </a>
              </td>
            </tr>
            )}
        </tbody>
      </table>
    );
    } else if (this.state.suggestionType === 'topPlayersADP') {
      const tops = ['QB', 'WR', 'RB', 'TE'];
      const playerMap = this.props.playerMap;
      const playerPool = this.state.playerPool.slice().sort((a, b) => {
        const playerA = playerMap.get(a);
        const playerB = playerMap.get(b);
        if (!playerA[adp]) return -1;
        if (!playerB[adp]) return 1;
        return playerA[adp][0][this.props.values.adpKey] - playerB[adp][0][this.props.values.adpKey];
      });
      let topPlayersADP = tops.map(position => {
        let player = null;
        playerPool.some(x => {
          const p = playerMap.get(x);
          if (p.position === position) {
            player = p;
            return true;
          }
        });
        return player;
      });
      topPlayersADP = topPlayersADP.filter(x => x !== null);
      pickSuggestionView = (
        <table className="table table-hover">
          <tbody>
            {topPlayersADP.map(player =>
              <tr>
                <td className="project-title">
                  <strong>{player.name}</strong>
                  <br />
                <small>
                  {player.team} | {player.position}
                </small>
              </td>
              <td className="text-center">
                ADP vs Pick
                <br />
                <small>
                  {player[adp] && (this.state.pickNum - player[adp][0][this.state.values.adpKey]).toFixed(2)}
                </small>
              </td>
              <td className="text-center">
                ADP
                <br />
                <small>
                  {
                    player[adp] &&
                    player[adp][0] &&
                    player[adp][0][this.state.values.adpKey]
                  }
                </small>
              </td>
              <td className="text-center">
                RAR
                <br />
                  <small>
                    {
                      player.rankings &&
                      player.rankings[0][this.state.values.rankKey]
                    }
                  </small>
              </td>
              <td className="project-actions">
                <a
                  href="#"
                  className="btn btn-primary btn-sm"
                  data-value={player.id}
                  onClick={this.selectPlayerFromList}
                >
                Select
                </a>
              </td>
            </tr>
            )}
        </tbody>
      </table>
    );
    } else {
      const pos = this.state.suggestionType;
      const playerMap = this.props.playerMap;
      const playerPool = this.state.playerPool;
      const players = [];
      playerPool.some(player => {
        const p = playerMap.get(player);
        if (p.position === pos) {
          players.push(p);
        }
        if (players.length > 4) return true;
      })
      pickSuggestionView = (
        <table className="table table-hover">
          <tbody>
            {players.map(player =>
              <tr>
                <td className="project-title">
                  <strong>{player.name}</strong>
                  <br />
                <small>
                  {player.team} | {player.position}
                </small>
              </td>
              <td className="text-center">
                ADP vs Pick
                <br />
                <small>
                  {player[adp] && (this.state.pickNum - player[adp][0][this.state.values.adpKey]).toFixed(2)}
                </small>
              </td>
              <td className="text-center">
                ADP
                <br />
                <small>
                  {
                    player[adp] &&
                    player[adp][0] &&
                    player[adp][0][this.state.values.adpKey]
                  }
                </small>
              </td>
              <td className="text-center">
                RAR
                <br />
                  <small>
                    {
                      player.rankings &&
                      player.rankings[0][this.state.values.rankKey]
                    }
                  </small>
              </td>
              <td className="project-actions">
                <a
                  href="#"
                  className="btn btn-primary btn-sm"
                  data-value={player.id}
                  onClick={this.selectPlayerFromList}
                >
                Select
                </a>
              </td>
            </tr>
            )}
        </tbody>
      </table>
    );}

    const selectedPlayer = this.state.selectedPlayer ?
      this.props.playerMap.get(this.state.selectedPlayer.val) :
      null;

    if (this.state.pickNum > this.state.picks.length) {
      // const teamScoreMap = new Map(teams.map(team => {
      //   const teamsPicks = this.state.picks.filter(pick => pick.team === team.id);
      //   let teamsValue = 0;
      //   teamsPicks.forEach(x => { if (x.vsAdp) teamsValue += x.vsAdp; });
      //   return [team.id, teamsValue];
      // }))
      const sortedTeamPicks = teamPicks.slice().sort((a, b) => {
        if (!a.vsAdp) return 1;
        if (!b.vsAdp) return -1;
        return b.vsAdp - a.vsAdp
      });

      const bestPick = sortedTeamPicks[0];
      const worstPick = sortedTeamPicks[sortedTeamPicks.length - 1];
      return (
        <div className={mainclasses}>
          <div className="row">
            <div className="col-lg-12">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h2>
                    {`Draft Summary - ${this.state.date.getMonth()}/${this.state.date.getDate()}/${this.state.date.getFullYear()}`}
                  </h2>
                </div>
                <div className="ibox-content">
                  <div className="row">
                    <div className="col-sm-12 draftContainer">
                      <Tabs defaultActiveKey={1} id="tabs" className="draftBoard">
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
                                const team = teamMap.get(pick.team);
                                const classes = classnames({
                                  info: team.isUser,
                                  success: pick.draftPick === this.state.pick,
                                });
                                const player = this.props.playerMap.get(pick.player);
                                return (
                                  <tr key={pick.draftPick} className={classes}>
                                    <td className="text-center">{pick.draftPick}</td>
                                    <td> {player && player.name}</td>
                                    <td className="text-center small">
                                      <select
                                        name={pick.draftPick}
                                        value={pick.team}
                                        onChange={component.changeOwner}
                                      >
                                        {component.state.teams.map(t =>
                                          <option value={t.id}>{t.name}</option>
                                        )}
                                      </select>
                                    </td>
                                  </tr>
                                );}
                              )}
                            </tbody>
                          </table>
                        </Tab>
                        <Tab eventKey={3} title="Teams">
                          <div className="col-sm-12">
                            <div className="project-list">
                            <select
                              className="form-control m-b"
                              name="teamInViewer"
                              onChange={this.updateTeamInViewer}
                              value={this.state.teamInViewer}
                            >
                              {this.state.teams.map(team => <option value={parseInt(team.id)}>{team.name}</option>)}
                            </select>
                            <hr />
                            <h2>
                              Summary
                            </h2>
                            <table className="table table-hover">
                              <tbody>
                                <tr>
                                  <td>
                                    Total Picks vs ADP
                                  </td>
                                  <td>
                                    {(teamValue).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Best Pick
                                  </td>
                                  <td>
                                    {`${this.props.playerMap.get(bestPick.player).name} (${bestPick.vsAdp.toFixed(2)})`}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Worst Pick
                                  </td>
                                  <td>
                                    {`${this.props.playerMap.get(worstPick.player).name} (${worstPick.vsAdp.toFixed(2)})`}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <h2>Picks</h2>
                            <table className="table table-hover">
                              <tbody>
                                {teamPicks.map(teamPick => {
                                  const player = this.props.playerMap.get(teamPick.player);
                                  return (
                                    <tr>
                                      <td className="project-title">
                                        {teamPick.draftPick}
                                      </td>
                                      <td className="project-title">
                                        <strong>{player && player.name}</strong>
                                        <br />
                                      <small>
                                        {player && `${player.team} | ${player.position}`}
                                      </small>
                                    </td>
                                    <td className="text-center">
                                      ADP
                                      <br />
                                      <small>
                                        {
                                          player &&
                                          player[adp] &&
                                          player[adp][0] &&
                                          player[adp][0][this.state.values.adpKey]
                                        }
                                      </small>
                                    </td>
                                    <td className="text-center">
                                      Pick vs ADP
                                      <br />
                                      <small>
                                        {teamPick.vsAdp && (teamPick.vsAdp).toFixed(2)}
                                      </small>
                                    </td>
                                  </tr>
                                );
                                }
                              )}
                            </tbody>
                          </table>
                          </div>
                          </div>
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
    }

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
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox float-e-margins">
              <div className="ibox-title">
                <h2>
                  {
                    `Current Pick: ${this.state.pickNum} | On the Clock: ${
                      this.state.picks[this.state.pickNum - 1] &&
                      teamMap.get(this.state.picks[this.state.pickNum - 1].team).name
                    }`
                  }
                </h2>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-sm-12 draftContainer">
                    <Tabs defaultActiveKey={0} id="tabs" className="draftBoard">
                      <Tab eventKey={0} title="Player Select">
                        <div className="ibox-content">
                            <div className="row m-b-sm m-t-sm">
                              <div className="col-md-12">
                                <div className="project-list">
                                  {!teamMap.get(this.state.picks[this.state.pickNum - 1].team).isUser && (
                                    <div>
                                      <h3>Optionally Simulate the Next Pick</h3>
                                      <button className="btn btn-md btn-primary" onClick={this.simulatePick}>
                                        Simulate Pick
                                      </button>
                                    </div>
                                  )}
                                  <h2>Search</h2>
                                {this.state.playerPool &&
                                  <Select
                                    name="form-field-name"
                                    value={this.state.selectedPlayer}
                                    options={options}
                                    onChange={this.setPick}
                                  />
                                }
                                {selectedPlayer &&
                                  <table className="table table-hover">
                                    <tbody>
                                      <tr>
                                        <td className="project-title">
                                          {selectedPlayer.name}
                                          <br />
                                        <small>
                                          {selectedPlayer.team} | {selectedPlayer.position}
                                        </small>
                                      </td>
                                      <td className="text-center">
                                        ADP vs Pick
                                        <br />
                                        <small>
                                          {selectedPlayer[adp] && (this.state.pickNum - selectedPlayer[adp][0][this.state.values.adpKey]).toFixed(2)}
                                        </small>
                                      </td>
                                      <td className="text-center">
                                        ADP
                                        <br />
                                        <small>
                                          {
                                            selectedPlayer[adp] &&
                                            selectedPlayer[adp][0] &&
                                            selectedPlayer[adp][0][this.state.values.adpKey]
                                          }
                                        </small>
                                      </td>
                                      <td className="text-center">
                                        RAR
                                        <br />
                                          <small>
                                            {
                                              selectedPlayer.rankings &&
                                              selectedPlayer.rankings[0][this.state.values.rankKey]
                                            }
                                          </small>
                                      </td>
                                      <td className="project-actions">
                                        <a
                                          href="#"
                                          className="btn btn-primary btn-sm"
                                          onClick={this.selectPlayer}
                                        >
                                        Select
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                }
                                </div>
                              </div>
                            </div>
                            <hr />
                            <h2>DynastyFFTools Suggestion</h2>
                              <table className="table table-hover">
                                <tbody>
                                  <tr>
                                    <td className="project-title">
                                      <strong>{rankingBpa.name}</strong>
                                      <br />
                                    <small>
                                      {rankingBpa.team} | {rankingBpa.position}
                                    </small>
                                  </td>
                                  <td className="text-center">
                                    ADP vs Pick
                                    <br />
                                    <small>
                                      {rankingBpa[adp] && (this.state.pickNum - rankingBpa[adp][0][this.state.values.adpKey]).toFixed(2)}
                                    </small>
                                  </td>
                                  <td className="text-center">
                                    ADP
                                    <br />
                                    <small>
                                      {
                                        rankingBpa[adp] &&
                                        rankingBpa[adp][0] &&
                                        rankingBpa[adp][0][this.state.values.adpKey]
                                      }
                                    </small>
                                  </td>
                                  <td className="text-center">
                                    RAR
                                    <br />
                                      <small>
                                        {
                                          rankingBpa.rankings &&
                                          rankingBpa.rankings[0][this.state.values.rankKey]
                                        }
                                      </small>
                                  </td>
                                  <td className="project-actions">
                                    <a
                                      href="#"
                                      className="btn btn-primary btn-sm"
                                      data-value={rankingBpa.id}
                                      onClick={this.selectPlayerFromList}
                                    >
                                    Select
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <hr />
                            <div className="project-list">
                              <select
                                className="form-control m-b"
                                name="pickSuggestionType"
                                onChange={this.updateSuggestionType}
                                value={this.state.suggestionType}
                              >
                                <option value="expert">Expert Rankings</option>
                                <option value="topPlayersRank">Top Players By Position (RAR)</option>
                                <option value="topPlayersADP">Top Players By Position (ADP)</option>
                                <option value="QB">QBs</option>
                                <option value="WR">WRs</option>
                                <option value="RB">RBs</option>
                                <option value="TE">TEs</option>
                              </select>
                              <h2>Other Suggestions</h2>
                              {pickSuggestionView}
                          </div>
                        </div>
                      </Tab>
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
                              const team = teamMap.get(pick.team);
                              const classes = classnames({
                                info: team.isUser,
                                success: pick.draftPick === this.state.pick,
                              });
                              const player = this.props.playerMap.get(pick.player);
                              return (
                                <tr key={pick.draftPick} className={classes}>
                                  <td className="text-center">{pick.draftPick}</td>
                                  <td> {player && player.name}</td>
                                  <td className="text-center small">
                                    <select
                                      name={pick.draftPick}
                                      value={pick.team}
                                      onChange={component.changeOwner}
                                    >
                                      {component.state.teams.map(t =>
                                        <option value={t.id}>{t.name}</option>
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
                            {this.state.userRankings.map((playerId) => {
                              const player = this.props.playerMap.get(playerId);
                              const classes = classnames({
                                strikeout: this.state.selectedPlayers.includes(playerId),
                              });
                              let valueLabel = null;
                              if (
                                (!this.state.selectedPlayers.includes(playerId) &&
                                player[adp] &&
                                this.state.pickNum - player[adp][0][this.props.values.adpKey] > 1 &&
                                this.state.pickNum - player[adp][0][this.props.values.adpKey] < 10)
                              ) valueLabel = (
                                <OverlayTrigger
                                  trigger={['hover', 'focus', 'click']}
                                  placement="bottom"
                                  overlay={
                                    <Popover title="Good Value Pick">
                                      This player is available {this.state.pickNum - player[adp][0][this.props.values.adpKey]} spots after their rank or ADP. This is a good value.
                                    </Popover>
                                  }
                                >
                                  <span className="label label-info">GOOD VALUE</span>
                                </OverlayTrigger>
                              );

                              if (
                                (!this.state.selectedPlayers.includes(playerId) &&
                                player[adp] &&
                                this.state.pickNum - player[adp][0][this.props.values.adpKey] > 9)
                              ) valueLabel = (
                                <OverlayTrigger
                                  trigger={['hover', 'focus', 'click']}
                                  placement="bottom"
                                  overlay={
                                    <Popover title="Great Value Pick">
                                      This player is available {this.state.pickNum - player[adp][0][this.props.values.adpKey]} spots after their rank or ADP. This is a great value.
                                    </Popover>
                                  }
                                >
                                  <span className="label label-danger">GREAT VALUE</span>
                                </OverlayTrigger>
                              );
                              return (
                                <tr className={classes}>
                                  <td><a data-value={player.id} onClick={this.openPlayerViewer}>{player.name}</a></td>
                                  <td>{valueLabel}</td>
                                  <td>{player.position}</td>
                                  <td>{player[adp] && player[adp][0][this.props.values.adpKey]}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </Tab>
                      <Tab eventKey={3} title="Teams">
                        <div className="col-sm-12">
                          <div className="project-list">
                          <select
                            className="form-control m-b"
                            name="teamInViewer"
                            onChange={this.updateTeamInViewer}
                            value={this.state.teamInViewer}
                          >
                            {this.state.teams.map(team => <option value={parseInt(team.id)}>{team.name}</option>)}
                          </select>
                          <hr />
                          <div className="form-group">
                            <h2>
                              Team Name
                            </h2>
                              <input
                                type="text"
                                className="form-control"
                                onChange={this.changeTeamName}
                                value={teamMap.get(this.state.teamInViewer).name}
                              />
                            <button className="btn btn-primary" onClick={this.saveTeams}>Save Name</button>
                          </div>
                          <h2>Picks</h2>
                          <table className="table table-hover">
                            <tbody>
                              {teamPicks.map(teamPick => {
                                const player = this.props.playerMap.get(teamPick.player);
                                return (
                                  <tr>
                                    <td className="project-title">
                                      {teamPick.draftPick}
                                    </td>
                                    <td className="project-title">
                                      <strong>{player && player.name}</strong>
                                      <br />
                                    <small>
                                      {player && `${player.team} | ${player.position}`}
                                    </small>
                                  </td>
                                  <td className="text-center">
                                    ADP
                                    <br />
                                    <small>
                                      {
                                        player &&
                                        player[adp] &&
                                        player[adp][0] &&
                                        player[adp][0][this.state.values.adpKey]
                                      }
                                    </small>
                                  </td>
                                  <td className="text-center">
                                    Pick vs ADP
                                    <br />
                                    <small>
                                      {teamPick.vsAdp && (teamPick.vsAdp).toFixed(2)}
                                    </small>
                                  </td>
                                </tr>
                              );
                              }
                            )}
                          </tbody>
                        </table>
                        </div>
                        </div>
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
