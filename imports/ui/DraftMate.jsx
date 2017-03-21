import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';


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
      currentStep: 1,
      pick: 1,
      picks: [],
      teams: [],
      selectedPlayers: [],
      usersPlayers: [],
    };
    this.updateOption = this.updateOption.bind(this);
    this.startDraft = this.startDraft.bind(this);
    this.draftReady = this.draftReady.bind(this);
  }

  draftReady() {
    return this.state.draftOptions.format !== '' &&
      this.state.draftOptions.orderFormat !== '';
  }
  startDraft(e) {
    e.preventDefault();
    const teams = this.state.draftOptions.teamCount;
    const rounds = this.state.draftOptions.roundCount;
    const draftType = this.state.draftOptions.orderFormat;
    const userPos = this.state.draftOptions.userPickPos;
    const picks = [];
    if (draftType === 'standard') {
      for (var i=0; i<rounds; i++) {
        const round = (i + 1).toString();
        for (var y=0; y<teams; y++) {
          let team = y + 1;
          if (team < 10) {
            team = `0${team}`;
          } else {
            team = team.toString();
          }
          const isPlayer = y + 1 === userPos;

          const teamName = isPlayer ? 'You' : `Team ${y+1}`;
          picks.push({
            draftPick: `${round}.${team}`,
            team: teamName,
            player: null,
            vsADP: null,
          });
        }
      }
    } else {
      for (var i=0; i<rounds; i++) {
        const round = (i + 1).toString();
        const reverse = i % 2 === 0;
        for (var y=0; y<teams; y++) {
          let pick = y + 1;
          if (pick < 10) {
            pick = `0${pick}`;
          } else {
            pick = pick.toString();
          }
          const teamNum = reverse ? y+1 : 12-y;
          const isPlayer = teamNum === userPos;
          const teamName = isPlayer ? 'You' : `Team ${teamNum}`;
          picks.push({
            draftPick: `${round}.${pick}`,
            team: teamName,
            player: null,
            vsADP: null,
          });
        }
      }
    }
    console.log('fooey');
    this.setState({
      draftStarted: true,
      picks,
    });
  }

  updateOption(e) {
    const newDraftOptions = this.state.draftOptions;
    newDraftOptions[e.target.name] = e.target.value;
    this.setState({ draftOptions: newDraftOptions });
  }

  render() {
    console.log(this.state);
    const startButton = this.draftReady() ?
      <button
        className="btn btn-primary"
        onClick={this.startDraft}>Start Draft
      </button> :
      <button
        className="btn btn-danger"
        disabled
        onClick={this.startDraft}>Select Options
      </button>
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
                      value={this.state.draftOptions.format}>
                        <option selected disabled>Select</option>
                        <option value="rookie">Rookie</option>
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
                      value={this.state.draftOptions.orderFormat}>
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
                      value={this.state.draftOptions.teamCount}>
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
                      value={this.state.draftOptions.roundCount}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">2QB</label>
                  <div className="col-sm-10">
                    <select
                      className="form-control m-b"
                      name="is2QB"
                      onChange={this.updateOption}
                      value={this.state.draftOptions.is2QB}>
                        <option selected disabled>Select</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Player Pick Position</label>
                  <div className="col-sm-10">
                    <input type="number"
                      className="form-control"
                      name="userPickPos"
                      value={this.state.draftOptions.userPickPos}
                      onChange={this.updateOption}
                      min="1"
                      max={this.state.draftOptions.teamCount}/>
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
    return (
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox float-e-margins">
              <div className="ibox-title">
                <h5>Draft</h5>
              </div>
              <div className="ibox-content">
                <div className="row">
                  <div className="col-lg-6">
                    <table className="table table-hover margin bottom">
                      <thead>
                        <tr>
                          <th style={{ width: '1%' }} className="text-center">Pick</th>
                          <th>Player</th>
                          <th className="text-center">Team</th>
                          <th className="text-center">vs ADP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.picks.map((pick) => {
                          const classes = pick.team === 'You' ? 'info' : null;
                          return (
                            <tr key={pick.draftPick} className={classes}>
                              <td className="text-center">{pick.draftPick}</td>
                              <td> {pick.player && pick.player.name}</td>
                              <td className="text-center small">{pick.team}</td>
                              <td className="text-center"><span className="label label-primary">{pick.vsADP}</span></td>
                            </tr>
                          )}
                        )}
                      </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DraftMate.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
