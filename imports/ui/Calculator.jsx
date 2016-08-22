import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import { Modal, Button, OverlayTrigger } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router';
import PageHeading from './PageHeading.jsx';
import ADPGraph from './ADPGraph.jsx';
import GoogleURL from 'google-url';
import $ from 'jquery';

const ageCalc = function(birthdate) {
  const bdate = birthdate ? birthdate : 680000000;
  const ageDifMs = Date.now() - bdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const googleUrl = new GoogleURL({ key: 'AIzaSyAbs9ol5Vtmr9SzguqVFh6iwJ2uDjx-s8U' });

class ShareUrl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLink: false,
      showLoading: false,
      shareURL: null,
    };
    this.getLink = this.getLink.bind(this);
  }
  getLink() {
    this.props.mixpanel.track('share trade');
    this.setState({ showLoading: true });
    const that = this;
    googleUrl.shorten(this.props.longURL, function(err, shortUrl) {
      if (err) console.log(err);
      that.setState({ shareURL: shortUrl, showLink: true, showLoading: false });
    });
  }
  showButton() {
    return (
      <button type="button" className="btn btn-lg btn-block btn-outline btn-primary" onClick={this.getLink}>Share this trade!</button>
    )
  }
  showLoading() {
    return (
      <div className="sk-spinner sk-spinner-wave">
          <div className="sk-rect1"></div>
          <div className="sk-rect2"></div>
          <div className="sk-rect3"></div>
          <div className="sk-rect4"></div>
          <div className="sk-rect5"></div>
      </div>
    )
  }
  showLink() {
    return (
      <h2>Share this link: {this.state.shareURL}</h2>
    )
  }
  render() {
    if (this.state.showLink) return this.showLink();
    if (this.state.showLoading) return this.showLoading();
    return this.showButton();
  }
}

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInstructions: true,
      showResults: false,
      team1: [],
      team2: [],
      shareURL: null,
      longURL: null,
      shouldShare: false,
      gettingShareURL: false,
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
    this.getShareURL = this.getShareURL.bind(this);
  }
  componentWillMount() {
    const that = this;
    if (that.props.location.query.share) {
      const team1 = [];
      if (!Array.isArray(that.props.location.query.t1)) {
        const player = that.props.players.find(function(pl) {
          return pl._id._str === that.props.location.query.t1;
        });
        team1.push(player);
      } else {
        that.props.location.query.t1.forEach(function(p) {
          const player = that.props.players.find(function(pl) {
            return pl._id._str === p;
          });
          team1.push(player);
        });
      }
      const team2 = [];
      if (!Array.isArray(that.props.location.query.t2)) {
        const player = that.props.players.find(function(pl) {
          return pl._id._str === that.props.location.query.t2;
        });
        team2.push(player);
      } else {
        that.props.location.query.t2.forEach(function(p) {
          const player = that.props.players.find(function(pl) {
            return pl._id._str === p;
          });
          team2.push(player);
        });
      }
      that.setState({
        team1,
        team2,
        showResults: true,
      });
    }
  }
  closeInstructions() {
    this.setState({ showInstructions: false });
  }
  closeResults() {
    this.setState({ showResults: false, shouldShare: false });
  }
  clearTrade() {
    this.setState({
      showResults: false,
      team1: [],
      team2: [],
      shouldShare: false,
    })
  }
  showResults() {
    // const that = this;
    this.props.mixpanel.track('evaluate trade');
    // googleUrl.shorten(longUrl, function(err, shortUrl) {
    //   if (err) console.log(err);
    //   that.setState({ shareURL: shortUrl, showResults: true });
    // });
    const that = this;
    that.setState({ showResults: true })
  }
  addToTeam1(val) {
      $('.compareSearch').addClass('has-success');
      setTimeout(function() {
        $('.compareSearch').removeClass('has-success');
      }, 1000);
      const oldSet = this.state.team1;
      oldSet.push(val.val);
      this.setState({ team1: oldSet });
  }
  removePlayerFromTeam1(player) {
    const newState = { team1: this.state.team1 };
    const index = newState.team1.indexOf(player);
    if (index > -1) {
      newState.team1.splice(index, 1);
      this.setState(newState);
    }
  }
  removePlayerFromTeam2(player) {
    const newState = { team2: this.state.team2 };
    const index = newState.team2.indexOf(player);
    if (index > -1) {
      newState.team2.splice(index, 1);
      this.setState(newState);
    }
  }
  addToTeam2(val) {
      $('.compareSearch').addClass('has-success');
      setTimeout(function() {
        $('.compareSearch').removeClass('has-success');
      }, 1000);
      const oldSet = this.state.team2;
      oldSet.push(val.val);
      this.setState({ team2: oldSet });
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
                Not sure if a trade is fair? DynastyFF Tool's Trade Calculator was
                created to help players make informed trade decisions based on
                Average Draft Position. Simply add the players being exchanged and
                get an in depth look at the players being exchanged.
              </p>
              <p>
                The values in the database are based on Average Draft Position, which
                means it represents where people are actually taking players in mock
                startup drafts. That means the numbers are based on people having to
                put their money where their mouths are.
              </p>
              <p>
                The Trade Calculator is not inteded to be the sole resource in any
                trade decision. While it can give some quick insight into whats being
                exchanged, real trade considerations should go much deeper than just
                this, or any single, tool.
              </p>
            </div>
          </div>
        </div>
      );
  }

  getShareURL() {
    // const that = this;
    // that.setState({ shouldShare: true })
    // googleUrl.shorten(that.state.longURL, function(err, shortUrl) {
    //   if (err) console.log(err);
    //   that.setState({ shareURL: shortUrl });
    // });
  }

  findClosestPlayer(val) {
    let curr = this.props.players[0];
    const past6MonthsValue = this.props.values.past6MonthsValue;
    this.props.players.forEach(function(player) {
      if (Math.abs(val - player[past6MonthsValue[5]]) < Math.abs(val - curr[past6MonthsValue[5]])) {
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
    const past6MonthsValue = this.props.values.past6MonthsValue;
    this.state.team1.forEach(function(player) {
      team1ValueSent += player[past6MonthsValue[5]]
    });
    let team2ValueSent = 0;
    this.state.team2.forEach(function(player) {
      team2ValueSent += player[past6MonthsValue[5]]
    });
    const team1ValueGained = team2ValueSent - team1ValueSent;
    const team2ValueGained = team1ValueSent - team2ValueSent;
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
          <h2>The difference is equal to <Link to={`/tools/players/${closestPlayer._id._str}`}>{closestPlayer.name}</Link> with an ADP of <strong>{closestPlayer[this.props.values.past6MonthsADP[5]]}</strong></h2>
        </div>
        )
      : null;
      // console.log(this.props.params);
    // ?list_a=1&list_a=2&list_a=3
    // apikey=AIzaSyA-wpBnY7yCf-V5yf9Jb7uwLeojtLU--3c

    let team1Str = '';
    this.state.team1.forEach(function(p, i) {
      team1Str += `&t1=${p._id._str}`
    });
    let team2Str = '';
    this.state.team2.forEach(function(p, i) {
      team2Str += `&t2=${p._id._str}`
    });

    const shareLink = `www.dynastyfftools.com/tools/calculator?share=true${team1Str}${team2Str}`;
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
    return (
      <div>
        <PageHeading current={"Trade Calculator"} db={this.props.currentDb} />
        {this.state.showInstructions && this.renderInstructions()}
        <div className="wrapper wrapper-content animated fadeIn">
          <div className="row">
            <div className="col-md-6 col-sm-12">
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
                            <td><Link to={`/tools/players/${player._id._str}`}>{player.name}</Link></td>
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
            <div className="col-md-6 col-sm-12">
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
                            <td><Link to={`/tools/players/${player._id._str}`}>{player.name}</Link></td>
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
                <div className="row">
                  <div className="col-md-6 calcSection">
                    <div className="flexContainer spaceBetween header4">
                      <div>Team 1 Gains:</div>
                      <div>{team1ValueGained}</div>
                    </div>
                        {this.state.team2.map((player) =>
                          <div className="calcResultRow">
                            <div>
                              <Link to={`/tools/players/${player._id._str}`}>{player.name}</Link>
                            </div>
                            <div>
                              {player[this.props.values.past6MonthsValue[5]]}
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
                              <Link to={`/tools/players/${player._id._str}`}>{player.name}</Link>
                            </div>
                            <div>
                              {player[this.props.values.past6MonthsValue[5]]}
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
                    <ADPGraph players={this.state.team1.concat(this.state.team2)} values={this.props.values} />
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
                <div className="row">
                  <div className="col-lg-12">
                    <div className="ibox">
                      <ShareUrl longURL={shareLink} mixpanel={this.props.mixpanel}/>
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
