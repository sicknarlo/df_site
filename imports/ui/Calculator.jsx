import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Modal, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router';
import PageHeading from './PageHeading.jsx';
import ADPGraph from './ADPGraph.jsx';
import PlayerADPRange from './PlayerADPRange.jsx';
import { Meteor } from 'meteor/meteor';
import $ from 'jquery';

class ShareUrl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLink: false,
      showLoading: false,
      shareURL: null,
    };
    this.getLink = this.getLink.bind(this);
    this.selectLink = this.selectLink.bind(this);
  }
  getLink() {
    this.props.mixpanel.track('share trade');
    this.setState({ showLoading: true });
    const that = this;
    $.ajax({
        url: 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyAbs9ol5Vtmr9SzguqVFh6iwJ2uDjx-s8U',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: '{ longUrl: "' + this.props.longURL +'"}',
        dataType: 'json',
        success: function(response) {
          // console.log(response);
          that.setState({ shareURL: response.id, showLink: true, showLoading: false });
        }
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
    );
  }
  selectLink() {
    const input = this.refs.input;
    // input.focus();
    input.setSelectionRange(0, input.value.length);
  }
  showLink() {
    return (
      <div>
        <h2>Share this link</h2>
        <input
          ref="input"
          className="form-control"
          readOnly
          value={this.state.shareURL}
          onClick={() => this.selectLink()}
        />
      </div>
    );
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
      startUpMode: false,
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
      this.props.mixpanel.track('came from link share');
      if (parseInt(that.props.location.query.super) === 1) {
        that.props.setDb('2qb');
      }
      const team1 = [];
      if (!Array.isArray(that.props.location.query.t1)) {
        const player = that.props.players.find((pl) => {
          return pl._id._str === that.props.location.query.t1;
        });
        team1.push(player);
      } else {
        that.props.location.query.t1.forEach((p) => {
          const player = that.props.players.find((pl) => {
            return pl._id._str === p;
          });
          team1.push(player);
        });
      }
      const team2 = [];
      if (!Array.isArray(that.props.location.query.t2)) {
        const player = that.props.players.find((pl) => {
          return pl._id._str === that.props.location.query.t2;
        });
        team2.push(player);
      } else {
        that.props.location.query.t2.forEach((p) => {
          const player = that.props.players.find((pl) => {
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
    const trade = {};
    trade.team1 = this.state.team1.map(x => x._id._str);
    trade.team2 = this.state.team2.map(x => x._id._str);
    let team1ValueSent = 0;
    this.state.team1.forEach((player) => {
      team1ValueSent += player.adp[0][this.props.values.valueKey]
    });
    let team2ValueSent = 0;
    this.state.team2.forEach((player) => {
      team2ValueSent += player.adp[0][this.props.values.valueKey]
    });
    trade.team1ValueGained = team2ValueSent - team1ValueSent;
    trade.team2ValueGained = team1ValueSent - team2ValueSent;
    trade.winningTeam = trade.team1ValueGained > trade.team2ValueGained ? 1 : 2;
    trade.closestPlayer = this.findClosestPlayer(Math.abs(trade.team1ValueGained))._id._str;
    trade.fairness = Math.round((Math.min(team1ValueSent, team2ValueSent) / Math.max(team1ValueSent, team2ValueSent)) * 100);
    Meteor.call('trades.create', trade, (error, result) => {
      if (error) console.log(error);
    });
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
                FantasyPros Expert Consensus Rankings.
              </p>
              <p>
                The values in the database are based on Expert Consensus Rankings, which
                means it represents where 25+ experts are ranking players right now and
                a sample of how players are being valued in the dynasty community.
              </p>
              <p>
                The Trade Calculator is not intended to be the sole resource in any
                trade decision. While it can give some quick insight into whats being
                exchanged, real trade considerations should go much deeper than just
                this, or any single, tool. Be careful of false positives whenever using.
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
    this.props.players.forEach((player) => {
      if (Math.abs(val - player.adp[0][this.props.values.valueKey]) < Math.abs(val - curr.adp[0][this.props.values.valueKey])) {
        curr = player;
      }
    })

    return curr;
  }


  render() {
    let options = [];
    if (this.state.startUpMode) {
      const sortedPlayers = this.props.players
        .slice()
        .sort((a, b) => a.adp[0][this.props.values.adpKey] - b.adp[0][this.props.values.adpKey]);
      let currentPick = 1;
      sortedPlayers.forEach(player => {
        options.push({ val: player, label: player.name });
        if (player.position !== 'PICK') {
          const pick = {};
          Object.assign(pick, player);
          pick.name = `Startup Pick ${currentPick}`;
          options.push({ val: pick, label: pick.name });
          currentPick ++;
        }
      })
    } else {
      options = this.props.players.map((player) => {
        return { val: player, label: player.name }
      })
    }

    let team1ValueSent = 0;
    this.state.team1.forEach((player) => {
      team1ValueSent += player.adp[0][this.props.values.valueKey]
    });
    let team2ValueSent = 0;
    this.state.team2.forEach((player) => {
      team2ValueSent += player.adp[0][this.props.values.valueKey]
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
          <h2>The difference is equal to <Link to={`/tools/players/${closestPlayer._id._str}`}>{closestPlayer.name}</Link> with an ADP of <strong>{closestPlayer.adp[0][this.props.values.adpKey]}</strong></h2>
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
    const dbShare = this.props.currentDb === '2qb' ? '&super=1' : '';
    const shareLink = `www.dynastyfftools.com/tools/calculator?share=true${team1Str}${team2Str}${dbShare}`;
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
          <div className="row textCenter">
            <h1>Startup Mode (Enable Startup Picks)</h1>
            <label className="switch">
              <input
                type="checkbox"
                value={this.state.startUpMode}
                onClick={() => this.setState({ startUpMode: !this.state.startUpMode })}
              />
              <div className="slider round"></div>
            </label>
          </div>
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
            <Modal
              show={this.state.showResults}
              bsSize="lg"
              onHide={this.closeResults}
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
                      <div>{team1ValueGained}</div>
                    </div>
                        {this.state.team2.map((player) => {
                          const badges = [];
                          if (
                            player.rankings &&
                            player.rankings[0] &&
                            player.adp[0][this.props.values.adpKey] - player.rankings[0][this.props.values.rankKey] > 9
                          ) badges.push(
                            (<div><i className="fa fa-thumbs-o-up"></i> `This player is ranked higher (${player.rankings[0][this.props.values.rankKey]}) than his current ECR (${player.adp[0][this.props.values.adpKey]})`</div>)
                          )

                          if (
                            player.rankings &&
                            player.rankings[0] &&
                            player.adp[0][this.props.values.adpKey] - player.rankings[0][this.props.values.rankKey] < -9
                          ) badges.push(
                            (<div><i className="fa fa-thumbs-o-down"></i> `This player is ranked lower (${player.rankings[0][this.props.values.rankKey]}) than his current ECR (${player.adp[0][this.props.values.adpKey]})`</div>)
                          )

                          if (
                            player.rankings &&
                            player.rankings[0] &&
                            player.adp[0][this.props.values.adpKey] - player.rankings[0][this.props.values.redraftRank] >
                              19
                          ) badges.push(
                            (<div><i className="fa fa-clock-o"></i> `This player's redraft rank is higher (${player.rankings[0][this.props.values.redraftRank]}) than his current ECR ({player.adp[0][this.props.values.adpKey]}). They could drop in value significantly</div>)
                          )

                          if (
                            player.rankings &&
                            player.rankings[0] &&
                            player.adp[0][this.props.values.adpKey] - player.rankings[0][this.props.values.redraftRank] <
                              19
                          ) badges.push(
                            (<div><i className="fa fa-clock-o"></i> This player's redraft rank is lower ({player.rankings[0][this.props.values.redraftRank]}) than his current ECR ({player.adp[0][this.props.values.adpKey]}). They may not justify their cost immediately.</div>)
                          )

                          if (player[this.props.values.trend3] > 9) badges.push(
                            (<div><i className="fa fa-rocket"></i> This player's ECR has increased significantly in the past 3 months ({player[this.props.values.trend3]}). They could continue to increase in value.</div>)
                          )

                          if (player[this.props.values.trend3] < -9) badges.push(
                            (<div><i className="fa fa-warning"></i> This player's ECR has decreased significantly in the past 3 months ({player[this.props.values.trend3]}). They could continue to decrease in value.</div>)
                          )

                          const warnCount = badges.length;

                          const warnBox = warnCount > 0 ? (
                            <OverlayTrigger
                              trigger={['hover', 'focus', 'click']}
                              placement="bottom"
                              overlay={
                                <Popover title="Call Outs" className="callouts">
                                  {badges.map(x => x)}
                                </Popover>
                              }
                            >
                              <span className="label label-warning">{warnCount}</span>
                            </OverlayTrigger>
                          ) : null;

                          return (
                            <div className="calcResultRow">
                              <div>
                                <Link to={`/tools/players/${player._id._str}`}>{player.name}</Link>&nbsp;
                                {warnBox}
                              </div>
                              <div>
                                {player.adp[0][this.props.values.valueKey]}
                              </div>
                            </div>
                          )
                        }
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
                    <PlayerADPRange players={this.state.team1.concat(this.state.team2)} values={this.props.values} />
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
