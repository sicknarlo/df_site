import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
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
export default class DraftMateCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draftOptions: {
        format: '',
        orderFormat: '',
        teamCount: 12,
        is2QB: false,
        roundCount: 18,
        userPickPos: 1,
      },
      ready: false,
      draftStarted: false,
      selectedPlayer: null,
      draftReady: false,
      rankingsReady: false,
      pick: null,
      currentTeam: null,
      nextTeam: null,
      picks: [],
      teams: [],
      playerPool: [],
      selectedPlayers: [],
      usersPlayers: [],
      userRankings: [],
      values: PValues.ppr,
      expertRankings: [],
      showTeamViewer: false,
      showRankingViewer: false,
      showPlayerViewer: false,
      playerInViewer: null,
    };
    this.updateOption = this.updateOption.bind(this);
    this.startDraft = this.startDraft.bind(this);
    this.draftReady = this.draftReady.bind(this);
  }

  componentDidMount() {
    Meteor.call('draftMateRankings.getRookieRankings', (error, result) => {
      if (!error) {
        this.setState({ rookieRankings: result[0].rankings })
      }
    });
    Meteor.call('draftMateRankings.get2QBRankings', (error, result) => {
      if (!error) {
        this.setState({ superRankings: result[0].super })
      }
    });
    Meteor.call('draftMateRankings.getStandardRankings', (error, result) => {
      if (!error) {
        this.setState({ standardRankings: result[0].standard })
      }
    });
  }

  draftReady() {
    return this.state.draftOptions.format !== '' &&
      this.state.draftOptions.orderFormat !== '';
  }

  startDraft(e) {
    e.preventDefault();
    let userRankings = [];
    let expertRankings = [];
    this.setState({ draftReady: false });
    if (this.state.draftOptions.format === 'rookie') {
      expertRankings = this.state.rookieRankings;
    } else if (this.state.draftOptions.is2QB) {
      expertRankings = this.state.superRankings;
    } else {
      expertRankings = this.state.standardRankings;
    }
    const teams = this.state.draftOptions.teamCount;
    const rounds = this.state.draftOptions.roundCount;
    const draftType = this.state.draftOptions.orderFormat;
    const userPos = this.state.draftOptions.userPickPos;
    const values = this.state.draftOptions.is2QB ? PValues.super : PValues.ppr;
    const t = [];
    const playerPool = this.state.draftOptions.format === 'rookie' ?
      this.props.players.filter((p) => p.status === 'R' && p.position !== 'PICK')
                        .sort((a, b) => a[values.rank] - b[values.rank]) :
      this.props.players.filter((p) => p.position !== 'PICK')
                        .sort((a, b) => a[values.rank] - b[values.rank]);

    for (let i = 0; i < teams; i++) {
      const name = i + 1 === userPos ? 'You' : `Team ${i + 1}`;
      t.push({ name, picks: [] });
    }
    const picks = [];
    if (draftType === 'standard') {
      for (let i = 0; i < rounds; i++) {
        const round = (i + 1).toString();
        for (let y = 0; y < teams; y++) {
          let team = y + 1;
          if (team < 10) {
            team = `0${team}`;
          } else {
            team = team.toString();
          }
          const isUser = y + 1 === userPos;

          const teamName = isUser ? 'You' : `Team ${y + 1}`;
          picks.push({
            draftPick: `${round}.${team}`,
            team: teamName,
            player: null,
            vsADP: null,
            isUser,
          });
        }
      }
    } else {
      for (let i = 0; i < rounds; i++) {
        const round = (i + 1).toString();
        const reverse = i % 2 === 0;
        for (let y = 0; y < teams; y++) {
          let pick = y + 1;
          if (pick < 10) {
            pick = `0${pick}`;
          } else {
            pick = pick.toString();
          }
          const teamNum = reverse ? y + 1 : 12 - y;
          const isUser = teamNum === userPos;
          const teamName = isUser ? 'You' : `Team ${teamNum}`;
          picks.push({
            draftPick: `${round}.${pick}`,
            team: teamName,
            player: null,
            vsADP: null,
            isUser,
          });
        }
      }
    }

    if (this.state.draftOptions.format === 'startup') {
      userRankings = playerPool.sort((a, b) => a.rankings[0][values.rankKey] - b.rankings[0][values.rankKey]);
    }

    const state = this.state;
    state.draftReady = true;
    state.draftStarted = true;
    state.picks = picks;
    state.teams = t;
    state.pick = '1.01';
    state.pickNum = 1;
    state.currentTeam = 1;
    state.nextTeam = 2;
    state.values = values;
    state.expertRankings = expertRankings;
    state.playerPool = playerPool.map(p => p.id);
    state.userRankings = userRankings.map(p => p.id);
    state.rookieRankings = null;
    state.standardRankings = null;
    state.superRankings = null;
    Meteor.call('drafts.create', state, (error, result) => {
      browserHistory.push(`/tools/draft-mate/${result}`);
    });
  }

  updateOption(e) {
    const newDraftOptions = this.state.draftOptions;
    newDraftOptions[e.target.name] = e.target.value;
    this.setState({ draftOptions: newDraftOptions });
  }

  setPick(val) {
    this.setState({ selectedPlayer: val });
  }

  render() {
    const component = this;
    const startButton = this.draftReady() ?
      <button
        className="btn btn-primary"
        onClick={this.startDraft}
      >
        Start Draft
      </button> :
      <button
        className="btn btn-danger"
        disabled
        onClick={this.startDraft}
      >
        Select Options
      </button>;
    const teamOptions = [];

    for (let i = 0; i < this.state.draftOptions.teamCount; i++) {
      teamOptions.push(i + 1);
    }

    if (!this.state.draftStarted) {
      return (
        <div className="col-lg-12">
          <div className="ibox float-e-margins">
            <div className="ibox-title">
              <h3>Set up <small>Customize Your Draft</small></h3>
            </div>
            <div className="ibox-content">
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-sm-2 control-label">Draft Type</label>
                  <div className="col-sm-10">
                    <select
                      className="form-control m-b"
                      name="format"
                      onChange={this.updateOption}
                      value={this.state.draftOptions.format}
                    >
                        <option selected disabled>Select</option>
                        <option disabled value="rookie">Rookie</option>
                        <option value="startup">Start Up</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Draft Format</label>
                  <div className="col-sm-10">
                    <select
                      className="form-control m-b"
                      name="orderFormat"
                      onChange={this.updateOption}
                      value={this.state.draftOptions.orderFormat}
                    >
                        <option selected disabled>Select</option>
                        <option value="standard">Standard</option>
                        <option value="snake">Snake</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Number of Teams</label>
                  <div className="col-sm-10">
                    <select
                      className="form-control m-b"
                      name="teamCount"
                      onChange={this.updateOption}
                      value={this.state.draftOptions.teamCount}
                    >
                        <option selected disabled>Select</option>
                        <option value={8}>8</option>
                        <option value={10}>10</option>
                        <option value={12}>12</option>
                        <option value={14}>14</option>
                        <option value={16}>16</option>
                        <option value={18}>18</option>
                        <option value={20}>20</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Number of Rounds</label>
                  <div className="col-sm-10">
                    <input type="number"
                      name="roundCount"
                      className="form-control"
                      onChange={this.updateOption}
                      value={this.state.draftOptions.roundCount}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">2QB</label>
                  <div className="col-sm-10">
                    <select
                      className="form-control m-b"
                      name="is2QB"
                      onChange={this.updateOption}
                      value={this.state.draftOptions.is2QB}
                    >
                        <option selected disabled>Select</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Player Pick Position</label>
                  <div className="col-sm-10">
                    <select
                      className="form-control"
                      name="userPickPos"
                      value={this.state.draftOptions.userPickPos}
                      onChange={this.updateOption}
                    >
                      {teamOptions.map(o => <option value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-xs-4 flexContainer justifyCenter">
                    {startButton}
                  </div>
                </div>
              </form>
            </div>
          </div>
      </div>
    );}
    return (
      <div className="wrapper wrapper-content animated fadeInRight">
        Starting
      </div>
    );
  }
}

DraftMateCreate.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
