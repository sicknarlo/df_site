import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import PValues from './ADPConst.jsx';
import PlayerModal from './PlayerModal.jsx';
import Select from 'react-select';
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
    this.changeOwner = this.changeOwner.bind(this);
    this.setPick = this.setPick.bind(this);
    this.selectPlayer = this.selectPlayer.bind(this);
    this.toggleTeamViewer = this.toggleTeamViewer.bind(this);
    this.toggleRankingViewer = this.toggleRankingViewer.bind(this);
    this.openPlayerViewer = this.openPlayerViewer.bind(this);
    this.closePlayerViewer = this.closePlayerViewer.bind(this);
    this.selectPlayerInViewer = this.selectPlayerInViewer.bind(this);
  }

  openPlayerViewer(p) {
    const playerName = p.target.text.substr(0, p.target.text.indexOf("|")-1) == "" ?
      p.target.text :
      p.target.text.substr(0, p.target.text.indexOf("|")-1);
    const player = this.props.players.find(p => p.name === playerName)
    this.setState({
      showPlayerViewer: true,
      playerInViewer: player,
      showRankingViewer: false,
    });
  }

  closePlayerViewer() {
    this.setState ({
      showPlayerViewer: false,
      playerInViewer: null,
    });
  }

  draftReady() {
    return this.state.draftOptions.format !== '' &&
      this.state.draftOptions.orderFormat !== '';
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
    this.setState({ picks: newPicks });
  }

  startDraft(e) {
    e.preventDefault();
    let userRankings = [];
    this.setState({ draftReady: false, rankingsReady: false });
    let expertRankings = [];
    if (this.state.draftOptions.format === 'rookie') {
      Meteor.call('draftMateRankings.getRookieRankings', (error, result) => {
        if (!error) {
          this.setState({ expertRankings: result[0].rankings , rankingsReady: true })
        }
      });
    } else if (this.state.draftOptions.is2QB) {
      Meteor.call('draftMateRankings.get2QBRankings', (error, result) => {
        if (!error) {
          this.setState({ expertRankings: result[0].super , rankingsReady: true })
        }
      });
    } else {
      Meteor.call('draftMateRankings.getStandardRankings', (error, result) => {
        if (!error) {
          console.log(result);
          this.setState({ expertRankings: result[0].standard , rankingsReady: true })
        }
      });
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
      const name = i + 1 == userPos ? 'You' : `Team ${i + 1}`;
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
          const isUser = y + 1 == userPos;

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
          const isUser = teamNum == userPos;
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
      userRankings = playerPool.sort((a, b) => a[values.rank] - b[values.rank]);
    }

    this.setState({
      draftReady: true,
      draftStarted: true,
      picks,
      teams: t,
      playerPool,
      pick: '1.01',
      pickNum: 1,
      currentTeam: 1,
      nextTeam: 2,
      values,
      userRankings,
      expertRankings,
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

  selectPlayerInViewer(e) {
    e.preventDefault();
    const player = this.state.playerPool.find(x => x == this.state.playerInViewer);
    const newPlayerPool = this.state.playerPool.filter(x => x != player);
    const expertRankings = this.state.expertRankings.filter(er => player.id !== er);
    const newPicks = this.state.picks;
    const currentPick = this.state.picks[this.state.pickNum - 1];
    currentPick.player = player;
    newPicks[this.state.pickNum - 1] = currentPick;
    const nextPick = this.state.picks[this.state.pickNum];
    const newSelectedPlayers = this.state.selectedPlayers;
    newSelectedPlayers.push(player);

    this.setState({
      playerPool: newPlayerPool,
      draftReady: true,
      draftStarted: true,
      picks: newPicks,
      pick: nextPick.draftPick,
      pickNum: this.state.pickNum + 1,
      selectedPlayer: null,
      selectedPlayers: newSelectedPlayers,
      showPlayerViewer: false,
      playerInViewer: null,
      expertRankings,
    });
  }


  toggleTeamViewer() {
    this.setState({ showTeamViewer: !this.state.showTeamViewer });
  }

  selectPlayer(e) {
    e.preventDefault();
    const player = this.state.playerPool.find(x => x == this.state.selectedPlayer.val);
    const newPlayerPool = this.state.playerPool.filter(x => x != player);
    const expertRankings = this.state.expertRankings.filter(er => player.id != er);
    const newPicks = this.state.picks;
    const currentPick = this.state.picks[this.state.pickNum - 1];
    currentPick.player = player;
    newPicks[this.state.pickNum - 1] = currentPick;
    const nextPick = this.state.picks[this.state.pickNum];
    const newSelectedPlayers = this.state.selectedPlayers;
    newSelectedPlayers.push(player);

    this.setState({
      playerPool: newPlayerPool,
      draftReady: true,
      draftStarted: true,
      picks: newPicks,
      pick: nextPick.draftPick,
      pickNum: this.state.pickNum + 1,
      selectedPlayer: null,
      selectedPlayers: newSelectedPlayers,
      expertRankings,
    });
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
    );
    }
    const currentTeam = this.state.picks[this.state.currentTeam - 1].team;
    const onDeck = this.state.picks[this.state.nextTeam - 1].team;

    console.log(this.state.expertRankings);
    const nextBest = this.state.expertRankings &&
      this.state.expertRankings.map(x => this.props.players.find(p => p.id === x[0]));

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
    let majorAlertCount = 0;

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

    if (this.state.rankingsReady) return (
      <div className="wrapper wrapper-content animated fadeInRight">
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
                    <h2>On the Clock - {currentTeam}</h2>
                    <h3>On Deck - {onDeck}</h3>
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
