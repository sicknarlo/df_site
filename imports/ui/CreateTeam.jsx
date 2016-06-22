import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import Select from 'react-select';
import $ from 'jquery';
import { Link, browserHistory } from 'react-router';
import { Button } from 'react-bootstrap';

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

export default class CreateTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.currentUser,
      teamName: null,
      teamCount: 12,
      roster: [],
      isPPR: false,
      is2QB: false,
      isIDP: false,
    };
    this.updateTeamName = this.updateTeamName.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.togglePPR = this.togglePPR.bind(this);
    this.toggle2QB = this.toggle2QB.bind(this);
    this.toggleIDP = this.toggleIDP.bind(this);
    this.createTeam = this.createTeam.bind(this);
    this.removeFromRoster = this.removeFromRoster.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
  }

  removeFromRoster(player) {
    const oldRoster = this.state.roster;
    const index = oldRoster.indexOf(player);
    if (index > -1) {
      const newRoster = oldRoster.splice(index, 1);
      this.setState({ roster: newRoster });
    }
  }

  addPlayer(p) {
    if (!this.state.roster.indexOf(p.val) > -1) {
      const newRoster = this.state.roster;
      newRoster.push(p.val);
      this.setState({ roster: newRoster });
    }
  }

  togglePPR() {
    this.setState({ isPPR: !this.state.isPPR });
  }
  toggle2QB() {
    this.setState({ is2QB: !this.state.is2QB });
  }
  toggleIDP() {
    this.setState({ isIDP: !this.state.isIDP });
  }
  updateTeamName(e) {
    this.setState({ teamName: e.target.value });
  }
  handleSelect(e) {
    this.setState({ teamCount: e.target.value });
  }
  createTeam() {
    const team = {
      teamName: this.state.teamName,
      teamCount: this.state.teamCount,
      players: this.state.roster,
      isPPR: this.state.isPPR,
      is2QB: this.state.is2QB,
      isIDP: this.state.isIDP,
    };
    console.log(team);
    Meteor.call('teams.create', team);
    browserHistory.push('/dashboard');
  }
  render() {
    // if (! this.props.currentUser) {
    //   browserHistory.push('/login');
    // }
    const options = this.props.players.map(function(player) {
      return { val: player, label: player.name };
    });
    const submitButton = this.state.teamName && this.state.roster.length > 0
      ? <Button
          className="tradeButton"
          bsStyle="primary"
          bsSize="large"
          onClick={this.createTeam}>
            <i className="fa fa-check"></i>&nbsp;
            Create Team
        </Button>
      : <Button
          className="tradeButton"
          bsStyle="Danger"
          disabled
          bsSize="large">
            <i className="fa fa-times"></i>&nbsp;
            Team Name & Players Required
          </Button>;
    return (
      <div>
        <PageHeading current="Create Team" />
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-md-8">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Team Settings</h5>
                </div>
                <div className="ibox-content">
                  <form method="get" className="form-horizontal">
                    <div className="form-group">
                      <label className="col-sm-2 control-label">
                        Team Name
                      </label>
                      <div className="col-sm-10">
                        <input
                          type="text"
                          className="form-control"
                          onChange={this.updateTeamName} />
                      </div>
                    </div>
                    <div className="hr-line-dashed"></div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">
                        Number of teams in league
                      </label>
                      <div className="col-sm-10">
                        <select
                          className="form-control m-b"
                          value={this.state.teamCount}
                          onChange={this.handleSelect} >
                          <option>8</option>
                          <option>10</option>
                          <option>12</option>
                          <option>16</option>
                          <option>18</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">
                        Team Settings <br/>
                      </label>
                      <div className="col-sm-10">
                        <div>
                          <label>
                            <Checkbox
                              checkboxClass="icheckbox_flat-green"
                              increaseArea="20%"
                              label="PPR"
                              onChange={this.togglePPR}
                            />
                          </label>
                        </div>
                        <div>
                          <label>
                            <Checkbox
                              checkboxClass="icheckbox_flat-green"
                              increaseArea="20%"
                              label="2QB"
                              onChange={this.toggle2QB}
                            />
                          </label>
                        </div>
                        <div>
                          <label>
                            <Checkbox
                              checkboxClass="icheckbox_flat-green"
                              increaseArea="20%"
                              label="IDP"
                              onChange={this.toggleIDP}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Add Players</h5>
                </div>
                <div className="ibox-content">
                  <form role="form" className="form-inline">
                    <div className="form-group compareSearch">
                    {this.props.players &&
                      <Select
                        name="form-field-name"
                        value="one"
                        options={options}
                        onChange={this.addPlayer}
                      />
                    }
                    </div>
                  </form>
                  {this.state.roster.length > 0 &&
                    <table className="table">
                      <thead>
                      </thead>
                      <tbody>
                        {this.state.roster.length > 0 && this.state.roster.map((player) =>
                          <tr className="removePlayerRow">
                            <td><Link to={`/players/${player._id._str}`}>{player.name}</Link></td>
                            <td>
                              <div className="removePlayer" onClick={() => { this.removeFromRoster(player); } }>
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
            </div>
          </div>
          <div className="row flexContainer justifyCenter">
            {submitButton}
          </div>
        </div>
      </div>
    );
  }
}

CreateTeam.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
