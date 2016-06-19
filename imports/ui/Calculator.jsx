import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import { Modal, Button, OverlayTrigger } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router';

import PlayerRow from './PlayerRow.jsx';
import PageHeading from './PageHeading.jsx';
import ADPGraph from './ADPGraph.jsx';

const currentMonthADP = 'may_16';
const previousMonthADP = 'apr_16';
const currentMonthValue = 'may_16_value';
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

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInstructions: true,
      showResults: false,
      team1: [],
      team2: [],
    };
    this.closeInstructions = this.closeInstructions.bind(this);
    this.closeResults = this.closeResults.bind(this);
    this.clearTrade = this.clearTrade.bind(this);
    this.showResults = this.showResults.bind(this);
    this.addToTeam1 = this.addToTeam1.bind(this);
    this.addToTeam2 = this.addToTeam2.bind(this);
    this.removePlayerFromTeam1 = this.removePlayerFromTeam1.bind(this);
    this.removePlayerFromTeam2 = this.removePlayerFromTeam2.bind(this);
    this.findClosestPlayer = this.findClosestPlayer.bind(this);
  }
  closeInstructions() {
    this.setState({ showInstructions: false });
  }
  closeResults() {
    this.setState({ showResults: false });
  }
  clearTrade() {
    this.setState({
      showResults: false,
      team1: [],
      team2: [],
    })
  }
  showResults() {
    this.setState({ showResults: true });
  }
  addToTeam1(val) {
    if (this.state.team1.indexOf(val.val) > -1) {
      $('.compareSearch').addClass('has-error');
      setTimeout(function() {
        $('.compareSearch').removeClass('has-error');
      }, 1000);
    } else {
      $('.compareSearch').addClass('has-success');
      setTimeout(function() {
        $('.compareSearch').removeClass('has-success');
      }, 1000);
      const oldSet = this.state.team1;
      oldSet.push(val.val);
      this.setState({ team1: oldSet });
    }
  }
  removePlayerFromTeam1(player) {
    const newState = { team1: this.state.team1 };
    const index = newState.team1.indexOf(player);
    if (index > -1) {
      console.log('worky');
      newState.team1.splice(index, 1);
      this.setState(newState);
    }
  }
  removePlayerFromTeam2(player) {
    const newState = { team2: this.state.team2 };
    const index = newState.team2.indexOf(player);
    if (index > -1) {
      console.log('worky');
      newState.team2.splice(index, 1);
      this.setState(newState);
    }
  }
  addToTeam2(val) {
    if (this.state.team2.indexOf(val.val) > -1) {
      $('.compareSearch').addClass('has-error');
      setTimeout(function() {
        $('.compareSearch').removeClass('has-error');
      }, 1000);
    } else {
      $('.compareSearch').addClass('has-success');
      setTimeout(function() {
        $('.compareSearch').removeClass('has-success');
      }, 1000);
      const oldSet = this.state.team2;
      oldSet.push(val.val);
      this.setState({ team2: oldSet });
    }
  }
  renderInstructions() {
    return (
        <div className="col-lg-12">
          <div className="ibox float-e-margins">
            <div className="ibox-title instructionsTitle">
              <h5>Instructions</h5>
              <div
                onClick={this.closeInstructions}
                className="clickable" >
                <i className="fa fa-times"></i>
              </div>
            </div>
            <div className="ibox-content">
              <h2 >
                The Dynasty Fantasy Football Trade Calculator<br />
              </h2>
              <p>
                <strong>Lorem ipsum dolor</strong>
                Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque
                penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
                Nulla consequat massa quis enim.
              </p>
              <p>
                <small>
                  Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
                  arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                  justo. Nullam dictum felis eu pede mollis pretium. Integer
                  tincidunt. Cras dapibus. Vivamus elementum semper nisi.
                </small>
              </p>
            </div>
                {/*<div className="ibox-footer">
                  <span className="pull-right">
                    The righ side of the footer
                  </span>
                    This is simple footer example
                </div>*/}
          </div>
        </div>
      )
  }

  findClosestPlayer(val) {
    let curr = this.props.players[0];
    this.props.players.forEach(function(player) {
      if (Math.abs(val - player[currentMonthValue]) < Math.abs(val - curr[currentMonthValue])) {
        curr = player;
      }
    })

    return curr;
  }


  render() {
    const options = this.props.players.map(function(player) {
      return { val: player, label: player.name }
    })
    let team1ValueSent = 0;
    this.state.team1.forEach(function(player) {
      team1ValueSent += player[currentMonthValue]
    });
    let team2ValueSent = 0;
    this.state.team2.forEach(function(player) {
      team2ValueSent += player[currentMonthValue]
    });

    const team1ValueGained = team2ValueSent - team1ValueSent;
    const team2ValueGained = team1ValueSent - team2ValueSent;
    const submitButton = this.state.team1.length > 0 && this.state.team2.length > 0
      ? <Button
          className="tradeButton"
          bsStyle="primary"
          bsSize="large"
          onClick={this.showResults}>
            <i className="fa fa-random"></i>&nbsp;
            Calculate the Trade
        </Button>
      : <Button
          className="tradeButton"
          bsStyle="Danger"
          disabled
          bsSize="large">
            <i className="fa fa-times"></i>&nbsp;
            Add players to both teams
        </Button>;
    const fairness = Math.round((Math.min(team1ValueSent, team2ValueSent) / Math.max(team1ValueSent, team2ValueSent)) * 100);
    const fairnessText = `${fairness}% Fair`;
    let degree = null;
    if (fairness > 89) {
      degree = <span className='greenText'>Slightly</span>;
    } else if (fairness > 79) {
      degree = <span className='yellowText'>Moderately</span>;
    } else {
      degree = <span className = 'redText'>Heavily</span>
    }
    const winningTeam = team1ValueGained > team2ValueGained ? 'Team 1' : 'Team 2';
    const fairnessStatement = <div className="fairnessStatement">
                                This trade is {degree} in favor of {winningTeam}
                              </div>;
    const closestPlayer = this.findClosestPlayer(Math.abs(team1ValueGained));
    const closestPlayerString = closestPlayer
      ? (<div>
          <h2>The difference is equal to <Link to={`/players/${closestPlayer._id._str}`}>{closestPlayer.name}</Link> with an ADP of <strong>{closestPlayer[currentMonthADP]}</strong></h2>
        </div>
        )
      : null;
      // console.log(this.props.params);
    return (
      <div>
        <PageHeading current={"Trade Calculator"} />
        {this.state.showInstructions && this.renderInstructions()}
        <div className="wrapper wrapper-content animated fadeIn">
          <div className="row">
            <div className="col-lg-6 col-sm-12">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Team 1 Sends</h5>
                </div>
                <div className="ibox-content">
                  <form role="form" className="form-inline">
                    <div className="form-group team1Calc">
                    {this.props.players &&
                      <Select
                        name="form-field-name"
                        value="one"
                        options={options}
                        onChange={this.addToTeam1}
                      />
                    }
                    </div>
                  </form>
                  {this.state.team1.length > 0 &&
                    <table className="table">
                      <thead>
                      </thead>
                      <tbody>
                        {this.state.team1.length > 0 && this.state.team1.map((player) =>
                          <tr className="removePlayerRow">
                            <td><Link to={`/players/${player._id._str}`}>{player.name}</Link></td>
                            <td>
                              <div className="removePlayer" onClick={() => { this.removePlayerFromTeam1(player); } }>
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
            <div className="col-lg-6 col-sm-12">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Team 2 Sends</h5>
                </div>
                <div className="ibox-content">
                  <form role="form" className="form-inline">
                    <div className="form-group team2Calc">
                    {this.props.players &&
                      <Select
                        name="form-field-name"
                        value="one"
                        options={options}
                        onChange={this.addToTeam2}
                      />
                    }
                    </div>
                  </form>
                  {this.state.team2.length > 0 &&
                    <table className="table">
                      <thead>
                      </thead>
                      <tbody>
                        {this.state.team2.length > 0 && this.state.team2.map((player) =>
                          <tr className="removePlayerRow">
                            <td><Link to={`/players/${player._id._str}`}>{player.name}</Link></td>
                            <td>
                              <div className="removePlayer" onClick={() => { this.removePlayerFromTeam2(player); } }>
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
            <Modal show={this.state.showResults} bsSize="lg" onHide={this.closeResults} className="inmodal">
              <Modal.Header closeButton><br />
              <i className="fa fa-line-chart modal-icon"></i><br />
                <Modal.Title>
                  Results
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div classNames="row">
                  <div className="col-md-6 calcSection">
                    <div className="flexContainer spaceBetween header4">
                      <div>Team 1 Gains:</div>
                      <div>{team1ValueGained}</div>
                    </div>
                        {this.state.team2.map((player) =>
                          <div className="calcResultRow">
                            <div>
                              <Link to={`/players/${player._id._str}`}>{player.name}</Link>
                            </div>
                            <div>
                              {player[currentMonthValue]}
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
                        {team2ValueGained}
                      </div>
                    </div>
                        {this.state.team1.map((player) =>
                          <div className="calcResultRow">
                            <div>
                              <Link to={`/players/${player._id._str}`}>{player.name}</Link>
                            </div>
                            <div>
                              {player[currentMonthValue]}
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
                        <h3>{fairnessStatement}</h3>
                        <h2>{fairness}% Fair</h2>
                        <div className="progress progress-mini">
                          <div
                            style={{ width: `${fairness}%` }}
                            className={classnames('progress-bar', {
                              greenBackground: fairness > 89,
                              yellowBackground: fairness < 90 && fairness > 79,
                              redBackground: fairness < 80,
                            })}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <ADPGraph players={this.state.team1.concat(this.state.team2)} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="ibox">
                      <div className="ibox-content">
                        {closestPlayerString}
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="flexContainer spaceBetween">
                <Button onClick={this.clearTrade} bsStyle="danger">Clear Trade</Button>
                <Button onClick={this.closeResults}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
          <div className="row flexContainer justifyCenter">
            {submitButton}
          </div>
        </div>
      </div>
    );
  }
}

Calculator.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
