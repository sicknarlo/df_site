import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import PageHeading from './PageHeading.jsx';
import ADPGraph from './ADPGraph.jsx';
import PlayerMetricsGraph from './PlayerMetricsGraph.jsx';
import SimilarPlayersTable from './SimilarPlayersTable.jsx';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import PlayerStats from './PlayerStats.jsx';
import StatMedians from './StatMedians.jsx';
import { Votes } from '../api/votes.js';

function getAge(dateString) {
  if (dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  return null;
}

function testImage(url) {
    // Define the promise
  const imgPromise = new Promise((resolve, reject) => {
        // Create the image
    const imgElement = new Image();
    // When image is loaded, resolve the promise
    imgElement.addEventListener('load', function imgOnLoad() {
      resolve(this);
    });

       // When there's an error during load, reject the promise
    imgElement.addEventListener('error', function imgOnError() {
      reject();
    })
    // Assign URL
    imgElement.src = url;
  });
  return imgPromise;
}

const nextYearsFirst = '2018 1st';
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
export default class PlayerModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: null,
      communityValue: 0,
      moves: 0,
      playerVote: null,
      selectedStat: 'fp',
      imgUrl: null,
    };
  }

  componentWillMount() {
    const component = this;
    if (this.state.imgUrl === null) {
      testImage(`http://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${this.props.player.espn_id}.png&w=350&h=254`).then(
        function fulfilled(img) {
          component.setState({ imgUrl: img });
        },
        function rejected() {
          component.setState({ imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png' })
        }
      );
    }
  }

  render() {
    const player = this.props.player;

    if (this.props.isRookie) {
      player.adp = player.rookieAdp;
      while (player.adp && player.adp.length < 6) {
        player.adp.push(player.adp[player.adp.length - 1]);
      }
    }
    if (!player) {
      return (
          <div className="sk-spinner sk-spinner-double-bounce">
            <div className="sk-double-bounce1"></div>
            <div className="sk-double-bounce2"></div>
          </div>
      );
    }

    // const this.props.players = this.props.players.sort(function(a, b) {
    //   if (a.rankings[0][this.props.values.rankKey] > b.rankings[0][this.props.values.rankKey]) {
    //     return 1;
    //   }
    //   if (a.rankings[0][this.props.values.rankKey] < b.rankings[0][this.props.values.rankKey]) {
    //     return -1;
    //   }
    //   // a must be equal to b
    //   return 0;
    // });
    const that = this;
    const sortedPlayers = this.props.players.sort(function(a, b) {
        if (a.rankings[0][that.props.values.rankKey] > b.rankings[0][that.props.values.rankKey]) {
          return 1;
        }
        if (a.rankings[0][that.props.values.rankKey] < b.rankings[0][that.props.values.rankKey]) {
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
      : getAge(player.birthdate);
    const topDetails = `${player.team} - ${player.position}`;
    const adpColorCls = player.adp && player.adp[0][this.props.values.adpKey] <= player.adp[1][this.props.values.adpKey]
      ? 'text-navy'
      : 'text-danger';
    const adpArrowCls = player.adp && player.adp[0][this.props.values.adpKey] >= player.adp[1][this.props.values.adpKey]
      ? 'fa fa-play fa-rotate-270'
      : 'fa fa-play fa-rotate-90';
    const trend3ColorCls = trend > 0
      ? 'text-navy'
      : 'text-danger';
    const trend3ArrowCls = trend > 0
      ? 'fa fa-play fa-rotate-270'
      : 'fa fa-play fa-rotate-90';
    const trend6Months = player.adp &&
      (player.adp[5][this.props.values.adpKey] - player.adp[0][this.props.values.adpKey]).toFixed(1);
    const trend6ColorCls = player.adp && trend6Months > 0
      ? 'text-navy'
      : 'text-danger';
    const trend6ArrowCls = player.adp && trend6Months > 0
      ? 'fa fa-play fa-rotate-270'
      : 'fa fa-play fa-rotate-90';

    const redraftRank = player.rankings[0][this.props.values.redraft]
    ? player.rankings[0][this.props.values.redraft]
    : 'N/A';

    const secondRank = this.props.isRookie ?
      (
        <div className="ibox-content dataPanel ">
          <h5 className="m-b-md">Rookie Rank</h5>
          <h2 >
            {player.rankings[0].rookie}
          </h2>
        </div>
      ) :
      (
        <div className="ibox-content dataPanel ">
          <h5 className="m-b-md">Redraft Rank</h5>
          <h2 >
            {redraftRank}
          </h2>
        </div>
      );


    const fpRank = player.rankings[0][this.props.values.rankKey]
      ? player.rankings[0][this.props.values.rankKey]
      : 'N/A';

    const pointsPassYards2014 = player.pass_yards_2014 * 0.04;
    const pointsPassYards2015 = player.pass_yards_2015 * 0.04;
    const pointsPassYards2016 = player.pass_yards_2016 * 0.04;

    const pointsPassTds2014 = player.pass_td_2014 * 6;
    const pointsPassTds2015 = player.pass_td_2015 * 6;
    const pointsPassTds2016 = player.pass_td_2016 * 6;

    const pointsReceptions2014 = player.rec_2014;
    const pointsReceptions2015 = player.rec_2015;
    const pointsReceptions2016 = player.rec_2016;

    const pointsRecYards2014 = player.rec_yards_2014 * 0.1;
    const pointsRecYards2015 = player.rec_yards_2015 * 0.1;
    const pointsRecYards2016 = player.rec_yards_2016 * 0.1;

    const pointsRecTds2014 = player.rec_td_2014 * 6;
    const pointsRecTds2015 = player.rec_td_2015 * 6;
    const pointsRecTds2016 = player.rec_td_2016 * 6;

    const pointsRushYds2014 = player.rush_yards_2014 * 0.1;
    const pointsRushYds2015 = player.rush_yards_2015 * 0.1;
    const pointsRushYds2016 = player.rush_yards_2016 * 0.1;

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
    const firstRoundPickIndex = (
        player.rankings[0][this.props.values.valueKey] / firstRoundPick.rankings[0][this.props.values.valueKey]).toFixed(2);
    const communityValue = this.state.communityValue > 0 ? `+${this.state.communityValue}` : this.state.communityValue;
    const communityCls = classnames({
      greenText: this.state.communityValue > 0,
      redText: this.state.communityValue < 0,
    });
    const trend = player.adp[2]
    ? (player.adp[2][this.props.values.adpKey] - player.adp[0][this.props.values.adpKey]).toFixed(1)
    : 0;

    let badges = [];

    if (
      player.adp[0][this.props.values.adpKey] - player.rankings[0][this.props.rankKey] > 9 &&
      player.adp[0][this.props.values.adpKey] - player.rankings[0][this.props.rankKey] < 20
    ) {
      badges.push(
        (
          <OverlayTrigger
            trigger={['hover', 'focus', 'click']}
            placement="bottom"
            overlay={
              <Popover title="Good Value Buy">
                This player's average ranking is over 10 spots greater than their current ADP. They could be a good buy.
              </Popover>
            }
          >
          <div className="badge badge-info playerBadge">
            <i className="fa fa-thumbs-o-up badgeIcon"></i><strong>Good Value Buy</strong>
          </div>
        </OverlayTrigger>)
      );
    } else if (
      player.adp[0][this.props.values.adpKey] - player.rankings[0][this.props.rankKey] >= 20
    ) {
      badges.push(
        (<OverlayTrigger
          trigger={['hover', 'focus', 'click']}
          placement="bottom"
          overlay={
            <Popover title="Great Value Buy">
              This player's average ranking is over 20 spots greater than their current ADP. They are a great buy at this value.
            </Popover>
          }
        >
          <div className="badge badge-green playerBadge">
            <i className="fa fa-dollar badgeIcon"></i><strong>Great Value Buy</strong>
          </div>
        </OverlayTrigger>)
        );
    } else if (
      player.adp[0][this.props.values.adpKey] - player.rankings[0][this.props.rankKey] <= -20
    ) {
      badges.push(
        (
          <OverlayTrigger
            trigger={['hover', 'focus', 'click']}
            placement="bottom"
            overlay={
              <Popover title="Great Sell Target">
                This player's average ranking is over 20 spots worse than their current ADP. They are being overvalued and should be sold at this value.
              </Popover>
            }
          >
          <div className="badge badge-danger playerBadge">
            <i className="fa fa-exclamation badgeIcon"></i><strong>Great Sell Target</strong>
          </div>
        </OverlayTrigger>
      )
        );
    } else if (
      player.adp[0][this.props.values.adpKey] - player.rankings[0][this.props.values.rankKey] < -9 &&
      player.adp[0][this.props.values.adpKey] - player.rankings[0][this.props.values.rankKey] > 20
    ) {
      badges.push(
        (
          <OverlayTrigger
            trigger={['hover', 'focus', 'click']}
            placement="bottom"
            overlay={
              <Popover title="Good Sell Target">
                This player's average ranking is over 10 spots worse than their current ADP. They are possibly being overvalued and could be a good guy to move.
              </Popover>
            }
          >
          <div className="badge badge-warning playerBadge">
            <i className="fa fa-thumbs-o-down badgeIcon"></i><strong>Good Sell Target</strong>
          </div>
        </OverlayTrigger>)
        );
    }

    if (
      player.adp[0][this.props.values.adpKey] - player.rankings[0][this.props.values.redraftRank] > 19
    ) {
      badges.push(
        (
          <OverlayTrigger
            trigger={['hover', 'focus', 'click']}
            placement="bottom"
            overlay={
              <Popover title="Win Now Player">
                This player's redraft ranking is over 20 spots higher than their ADP. They are more valuable for win-now teams, or are more likely to provide more immediate returns for their owner.
              </Popover>
            }
          >
          <div className="badge badge-warning playerBadge">
            <i className="fa fa-flash badgeIcon"></i><strong>Win Now</strong>
          </div>
        </OverlayTrigger>)
        );
    } else if (
      player.adp[0][this.props.values.adpKey] - player.rankings[0][this.props.values.redraftRank] < -19
    ) {
      badges.push(
        (
          <OverlayTrigger
            trigger={['hover', 'focus', 'click']}
            placement="bottom"
            overlay={
              <Popover title="Win Later Player">
                This player's redraft ranking is over 20 spots lower than their ADP. They are more valuable for win-later teams and may not provide as much immediate value this season.
              </Popover>
            }
          >
          <div className="badge badge-primary playerBadge">
            <i className="fa fa-rocket badgeIcon"></i><strong>Win Later</strong>
          </div>
        </OverlayTrigger>)
        );
    }

    if (trend > 9) {
      badges.push(
        (
          <OverlayTrigger
            trigger={['hover', 'focus', 'click']}
            placement="bottom"
            overlay={
              <Popover title="Trending Up">
                This player has increased in value by over 10 spots over the last 3 months.
              </Popover>
            }
          >
          <div className="badge badge-green playerBadge">
            <i className="fa fa-level-up badgeIcon"></i><strong>Trending Up</strong>
          </div>
        </OverlayTrigger>
      ));
    } else if (trend < -9) {
      badges.push(
        (
          <OverlayTrigger
            trigger={['hover', 'focus', 'click']}
            placement="bottom"
            overlay={
              <Popover title="Trending Down">
                This player has decreased in value by over 10 spots over the last 3 months.
              </Popover>
            }
          >
          <div className="badge badge-danger playerBadge">
            <i className="fa fa-level-down badgeIcon"></i><strong>Trending Down</strong>
          </div>
        </OverlayTrigger>)
        );
    }

    if (this.props.isRookie) badges = [];
    return (
      <Modal show={this.props.showPlayerViewer} bsSize="lg" onHide={this.props.closePlayerViewer} className="inmodal">
        <Modal.Header closeButton><br />
          <i className="fa fa-address-card modal-icon"></i><br />
          <Modal.Title>
            {this.props.player.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row animated fadeInRight">
            <div className="col-md-4">
              <div className="ibox float-e-margins">
                <div>
                  <div className="ibox-content border-left-right player-profilePic">
                    <img alt="image" className="img-responsive playerImg" src={this.state.imgUrl} />
                  </div>
                  <div className="ibox-content profile-content">
                    <div className="textCenter">
                      {this.props.selectPlayerButton}
                    </div>
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
                        <OverlayTrigger trigger={['hover', 'focus', 'click']} placement="bottom" overlay={<Popover title="DynastyFFTools 1st Round Pick Index">The players approximate worth in next year's 1st round picks.</Popover>}>
                          <i className="fa fa-question-circle text-navy"></i>
                        </OverlayTrigger>
                      </h3>
                    </div>
                    <div className="player-badges">
                      {badges.map(function(b) { return b })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-xs-6">
                  <div className="ibox">
                    <div className="ibox-content dataPanel">
                      <h5 className="m-b-md">Value</h5>
                      <h2 className="text-success">
                        <i className="fa fa-tag"></i> {player.rankings[0][this.props.values.valueKey]}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="ibox">
                    <div className="ibox-content dataPanel ">
                      <h5 className="m-b-md">ADP</h5>
                      <h2 className={adpColorCls}>
                        {player.adp ? player.adp[0][this.props.values.adpKey] : '--'}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="ibox">
                    <div className="ibox-content dataPanel ">
                      <h5 className="m-b-md">
                        RAR Rank&nbsp;
                        <OverlayTrigger trigger={['hover', 'focus', 'click']} placement="bottom" overlay={<Popover title="Rolling Aggregated Rank">The player's average ranking based on aggregated data from FantasyPros ECR.</Popover>}>
                          <i className="fa fa-question-circle text-navy"></i>
                        </OverlayTrigger>
                      </h5>
                      <h2 >
                        {fpRank}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="ibox">
                    {secondRank}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-6">
                  <div className="ibox">
                    <div className="ibox-content dataPanel">
                      <h5 className="m-b-md">3-Month Trend</h5>
                      <h2 className={trend3ColorCls}>
                        <i className={trend3ArrowCls}></i> {trend}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="col-xs-6">
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
        <div className="row playerRow">
          <div className="col-lg-12 graphContainer">
            {player.adp &&
              <ADPGraph
                players={[player]}
                values={this.props.values}
                isRookie={this.props.isRookie}
              />}
          </div>
        </div>
        {player.status !== "R" ? <PlayerStats player={player} /> : null}
        <div className="row playerRow">
          <div className="col-lg-12">
            {player.metrics && <PlayerMetricsGraph player={player} />}
          </div>
        </div>
        <div className="row playerRow">
          <div className="col-lg-12">
            <SimilarPlayersTable
              similarPlayers={similarPlayers}
              currentPlayer={player}
              values={this.props.values}
              openPlayerViewer={this.props.openPlayerViewer}
              isRookie={this.props.isRookie} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flexContainer spaceBetween">
        {this.props.selectPlayerButton}
        <Button onClick={this.props.closePlayerViewer}>Close</Button>
      </Modal.Footer>
    </Modal>
    );
  }
}

PlayerModal.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
