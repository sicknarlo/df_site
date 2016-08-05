import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import PageHeading from './PageHeading.jsx';
import ADPGraph from './ADPGraph.jsx';
import SimilarPlayersTable from './SimilarPlayersTable.jsx';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Votes } from '../api/votes.js';

const nextYearsFirst = '2017 1st';
const nextYearsSecond = '2017 2nd';
const nextYearsThird = '2017 3rd';
const nextYearsFourth = '2017 4th';

const _calculateAge = function(birthdate) {
  const ageDifMs = Date.now() - birthdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const _calculateHeight = function(inches) {
  const ft = Math.floor(inches / 12);
  const i = inches % 12;
  return `${ft}'${i}"`;
};

// Player component - represents a Player profile
export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: null,
      communityValue: 0,
      moves: 0,
      playerVote: null,
    };

    this.addVote = this.addVote.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const that = this;
    // Meteor.call('players.getPlayer', {
    //   playerId: this.props.params.playerID,
    // }, function(error, result) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log(result);
    //     that.setState({ player: result })
    //   }
    // });
    let moves = 0;
    let communityValue = 0;
    let playerVote = null;
    Meteor.call('votes.getPlayer', {
      playerId: this.props.params.playerID,
    }, function(error, result){
        if(error){
            console.log(error);
        } else {
          result.forEach(function(v) {
            moves ++;
            if (v.moveType === 'buy') communityValue ++;
            if (v.moveType === 'sell') communityValue --;
            if (v.userId === that.props.currentUser._id) {
              playerVote = v.moveType;
            }
          });
          that.setState({
            communityValue,
            moves,
            playerVote
          });
        };
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.playerID !== this.props.params.playerID) {
      window.scrollTo(0, 0);
      const that = this;
      // Meteor.call('players.getPlayer', {
      //   playerId: nextProps.params.playerID,
      // }, function(error, result) {
      //   if (error) {
      //   } else {
      //     that.setState({ player: result })
      //   }
      // });
      let moves = 0;
      let communityValue = 0;
      let playerVote = null;
      Meteor.call('votes.getPlayer', {
        playerId: nextProps.params.playerID,
      }, function(error, result){
          if(error){
              console.log(error);
          } else {
            result.forEach(function(v) {
              moves ++;
              if (v.moveType === 'buy') communityValue ++;
              if (v.moveType === 'sell') communityValue --;
              if (v.userId === that.props.currentUser._id) {
                playerVote = v.moveType;
              }
            });
            console.log(moves, communityValue, playerVote);
            that.setState({
              communityValue,
              moves,
              playerVote,
            });
          };
      });
    }
  }

  addVote(moveType) {
    // Meteor.subscribe('votes');
    if (moveType !== this.state.playerVote) {
      Meteor.call('votes.addVote', {
        playerId: this.props.params.playerID,
        moveType,
      });
      let moveChange = moveType === 'buy' ? 1 : -1;
      let voteChange = 0;
      if (this.state.playerVote !== null) {
        moveChange *= 2;
      } else {
        voteChange ++;
      }
      this.setState({
        playerVote: moveType,
        communityValue: this.state.communityValue + moveChange,
        moves: this.state.moves + voteChange,
      });
    }
  }

  render() {
    const player = this.props.players.find((p) => p._id._str === this.props.params.playerID);
    if (!player) {
      return (
          <div className="sk-spinner sk-spinner-double-bounce">
            <div className="sk-double-bounce1"></div>
            <div className="sk-double-bounce2"></div>
          </div>
      );
    }

    // const this.props.players = this.props.players.sort(function(a, b) {
    //   if (a[this.props.values.past6MonthsADP[5]] > b[this.props.values.past6MonthsADP[5]]) {
    //     return 1;
    //   }
    //   if (a[this.props.values.past6MonthsADP[5]] < b[this.props.values.past6MonthsADP[5]]) {
    //     return -1;
    //   }
    //   // a must be equal to b
    //   return 0;
    // });
    let sortByADP = {
      asc: function(a, b) {
        if (a[this.props.values.past6MonthsADP[5]] > b[this.props.values.past6MonthsADP[5]]) {
          return 1;
        }
        if (a[this.props.values.past6MonthsADP[5]] < b[this.props.values.past6MonthsADP[5]]) {
          return -1;
        }
        // a must be equal to b
        return 0;
      },
      desc: function(a, b) {
        if (a[this.props.values.past6MonthsADP[5]] > b[this.props.values.past6MonthsADP[5]]) {
          return -1;
        }
        if (a[this.props.values.past6MonthsADP[5]] < b[this.props.values.past6MonthsADP[5]]) {
          return 1;
        }
        // a must be equal to b
        return 0;
      },
      _str: 'sortByADP',
    };
    const that = this;
    const sortedPlayers = this.props.players.sort(function(a, b) {
        if (a[that.props.values.past6MonthsADP[5]] > b[that.props.values.past6MonthsADP[5]]) {
          return 1;
        }
        if (a[that.props.values.past6MonthsADP[5]] < b[that.props.values.past6MonthsADP[5]]) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });


    const playerADPRank = sortedPlayers.findIndex((p) => p._id._str === player._id._str);
    const previous5 = [];
    let i = playerADPRank - 1;
    let n = 0;
    while (i >= 0 && n < 5) {
      previous5.unshift(sortedPlayers[i]);
      i--;
      n++;
    }

    const next5 = [];
    i = playerADPRank + 1;
    n = 0;
    while (i <= sortedPlayers.length && n < 5) {
      next5.push(sortedPlayers[i]);
      i++;
      n++;
    }

    const similarPlayers = previous5.concat([player], next5);
    const imgLoc = player.position === 'PICK'
      ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'
      : `http://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${player.espn_id}.png&w=350&h=254`;
    const height = player.height === 'PICK' ? 'PICK' : _calculateHeight(player.height);
    const weight = player.weight === 'PICK' ? 'PICK' : `${player.weight}lbs`;
    const rotoLink = player.rotoworld_id === 'PICK' ? '#' : `http://www.rotoworld.com/player/nfl/${player.rotoworld_id}`;
    const experience = player.draft_year === 'PICK'
      ? 'PICK'
      : `${_calculateAge(new Date(player.draft_year - 1, 4, 1))} years`;
    const age = player.birthdate === 'PICK'
      ? 'PICK'
      : _calculateAge(new Date(player.birthdate * 1000));
    const topDetails = `${player.team} - ${player.position}`;
    const adpColorCls = player[this.props.values.past6MonthsADP[5]] >= player[this.props.values.past6MonthsADP[4]]
      ? 'text-navy'
      : 'text-danger';
    const adpArrowCls = player[this.props.values.past6MonthsADP[5]] >= player[this.props.values.past6MonthsADP[4]]
      ? 'fa fa-play fa-rotate-270'
      : 'fa fa-play fa-rotate-90';
    const trend3ColorCls = player.trend > 0
      ? 'text-navy'
      : 'text-danger';
    const trend3ArrowCls = player.trend > 0
      ? 'fa fa-play fa-rotate-270'
      : 'fa fa-play fa-rotate-90';
    const trend6Months = (player[this.props.values.past6MonthsADP[0]] - player[this.props.values.past6MonthsADP[5]]).toFixed(1);
    const trend6ColorCls = trend6Months > 0
      ? 'text-navy'
      : 'text-danger';
    const trend6ArrowCls = trend6Months > 0
      ? 'fa fa-play fa-rotate-270'
      : 'fa fa-play fa-rotate-90';

    const firstRoundPick = sortedPlayers.find((p) => p.name === nextYearsFirst);
    // const secondRoundPick = this.props.players.find((p) => p.name === nextYearsSecond);
    // const thirdRoundPick = this.props.players.find((p) => p.name === nextYearsThird);
    // const fourthRoundPick = this.props.players.find((p) => p.name === nextYearsFourth);
    // const firstRoundPickValue = firstRoundPick[this.props.values.past6MonthsValue[4]];
    // const secondRoundPickValue = secondRoundPick[this.props.values.past6MonthsValue[4]];
    // const thirdRoundPickValue = thirdRoundPick[this.props.values.past6MonthsValue[4]];
    // const fourthRoundPickValue = fourthRoundPick[this.props.values.past6MonthsValue[4]];
    //
    // let valueRemaining = player[this.props.values.past6MonthsValue[4]];
    const buyBtnCls = classnames({ 'primary': this.state.playerVote === 'buy' });
    const sellBtnCls = classnames({ 'danger': this.state.playerVote === 'sell' });

    const buySell = this.props.currentUser
      ? (
        <div className="col-sm-12 col-md-12 col-lg-12">
          <div className="ibox">
            <div className="ibox-content dataPanel">
              <h5 className="m-b-md textCenter">At an ADP of {player[this.props.values.past6MonthsADP[5]]}, are you buying or selling?</h5>
              <div className="buysellContainer">
                <ButtonGroup>
                    <Button
                        className="tradeButton btn-buy"
                        bsStyle={buyBtnCls}
                        bsSize="large"
                        onClick={this.addVote.bind(this, 'buy')}>
                          BUY
                     </Button>
                     <Button
                         className="tradeButton"
                         bsStyle={sellBtnCls}
                         bsSize="large"
                         onClick={this.addVote.bind(this, 'sell')}>
                           SELL
                     </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
      ) : null;
    const firstRoundPickIndex = (
        player[this.props.values.past6MonthsValue[4]] / firstRoundPick[this.props.values.past6MonthsValue[4]]).toFixed(2);
    const communityValue = this.state.communityValue > 0 ? `+${this.state.communityValue}` : this.state.communityValue;
    const communityCls = classnames({
      greenText: this.state.communityValue > 0,
      redText: this.state.communityValue < 0,
    })
    return (
      <div>
        <PageHeading current={player.name} db = {this.props.currentDb} additional={topDetails} />
        <div className="wrapper wrapper-content">
          <div className="row animated fadeInRight">
            <div className="col-md-4">
              <div className="ibox float-e-margins">
                <div>
                  <div className="ibox-content border-left-right player-profilePic">
                    <img alt="image" className="img-responsive playerImg" src={imgLoc} />
                  </div>
                  <div className="ibox-content profile-content">
                    {/*<div className="player-badges">
                      <div className="badge badge-primary playerBadge"><i className="fa fa-thumbs-o-up badgeIcon"></i><strong>BUY</strong></div>
                    </div>*/}
                    <table className="table">
                      <tbody>
                        <tr>
                            <td><strong>Age</strong></td>
                            <td>{age}</td>
                        </tr>
                        <tr>
                            <td><strong>Experience</strong></td>
                            <td>{experience}</td>
                        </tr>
                        <tr>
                            <td><strong>Height</strong></td>
                            <td>{height}</td>
                        </tr>
                        <tr>
                            <td><strong>Weight</strong></td>
                            <td>{weight}</td>
                        </tr>
                        <tr>
                            <td><strong>College</strong></td>
                            <td>{player.college}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="player-profileSection-content">
                      <h3>DynastyFFTools 1st Round Pick Index: <strong>{firstRoundPickIndex}</strong>&nbsp;
                      <OverlayTrigger trigger="click" placement="bottom" overlay={<Popover title="DynastyFFTools 1st Round Pick Index">The players approximate worth in next year's 1st round picks.</Popover>}>
                        <i className="fa fa-question-circle text-navy"></i>
                      </OverlayTrigger>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="row">
                {buySell}
                <div className="col-xs-12">
                  <div className="ibox">
                    <div className="ibox-content dataPanel text-center">
                      <h3 className="m-b-md">
                        Community Market Place&nbsp;
                        <OverlayTrigger trigger="click" placement="bottom" overlay={<Popover title="Community Value Rating">Net users who would buy or draft this player at the current ADP. Votes expire after 7 days.</Popover>}>
                          <i className="fa fa-question-circle text-navy"></i>
                        </OverlayTrigger>
                      </h3>
                      <div className="communityMarketplace">
                        <div className="communityMarketplace-left">
                          <h4>Community Rating</h4>
                          <h2 className={communityCls}>{communityValue}</h2>
                        </div>
                        <div className="communityMarketplace-left">
                          <h4>Community Votes</h4>
                          <h2>{this.state.moves}</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-6 col-lg-3">
                  <div className="ibox">
                    <div className="ibox-content dataPanel">
                      <h5 className="m-b-md">Value</h5>
                      <h2 className="text-success">
                        <i className="fa fa-tag"></i> {player[this.props.values.past6MonthsValue[4]]}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="col-xs-6 col-lg-3">
                  <div className="ibox">
                    <div className="ibox-content dataPanel ">
                      <h5 className="m-b-md">ADP</h5>
                      <h2 className={adpColorCls}>
                        <i className={adpArrowCls}></i> {player[this.props.values.past6MonthsADP[5]]}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="col-xs-6 col-lg-3">
                  <div className="ibox">
                    <div className="ibox-content dataPanel">
                      <h5 className="m-b-md">3-Month Trend</h5>
                      <h2 className={trend3ColorCls}>
                        <i className={trend3ArrowCls}></i> {player.trend}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="col-xs-6 col-lg-3">
                  <div className="ibox">
                    <div className="ibox-content dataPanel">
                      <h5 className="m-b-md">6-Month Trend</h5>
                      <h2 className={trend6ColorCls}>
                        <i className={trend6ArrowCls}></i> {trend6Months}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 graphContainer">
              <ADPGraph players={[player]} values={this.props.values} />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <SimilarPlayersTable similarPlayers={similarPlayers} currentPlayer={player} values={this.props.values} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Player.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
