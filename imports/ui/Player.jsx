import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import PageHeading from './PageHeading.jsx';
import ADPGraph from './ADPGraph.jsx';
import SimilarPlayersTable from './SimilarPlayersTable.jsx';

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

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    const player = this.props.players.find((p) => {
      return p._id._str === this.props.params.playerID;
    });

    if (!player) {
      return <div>Loading</div>;
    }

    // const this.props.players = this.props.players.sort(function(a, b) {
    //   if (a[currentMonthADP] > b[currentMonthADP]) {
    //     return 1;
    //   }
    //   if (a[currentMonthADP] < b[currentMonthADP]) {
    //     return -1;
    //   }
    //   // a must be equal to b
    //   return 0;
    // });

    const playerADPRank = this.props.players.indexOf(player);

    const previous5 = [];

    let i = playerADPRank - 1;
    let n = 0;
    while (i >= 0 && n < 5) {
      previous5.unshift(this.props.players[i]);
      i--;
      n++;
    }

    const next5 = [];
    i = playerADPRank + 1;
    n = 0;
    while (i <= this.props.players.length && n < 5) {
      next5.push(this.props.players[i]);
      i++;
      n++;
    }

    const similarPlayers = previous5.concat([player], next5);

    const imgLoc = player.position === 'PICK' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'
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
    const adpColorCls = player[currentMonthADP] >= player[previousMonthADP]
      ? 'text-navy'
      : 'text-danger';
    const adpArrowCls = player[currentMonthADP] >= player[previousMonthADP]
      ? 'fa fa-play fa-rotate-270'
      : 'fa fa-play fa-rotate-90';
    const trend3ColorCls = player.trend > 0
      ? 'text-navy'
      : 'text-danger';
    const trend3ArrowCls = player.trend > 0
      ? 'fa fa-play fa-rotate-270'
      : 'fa fa-play fa-rotate-90';

    const trend6Months = (player[past6MonthsADP[0]] - player[past6MonthsADP[5]]).toFixed(1);
    const trend6ColorCls = trend6Months > 0
      ? 'text-navy'
      : 'text-danger';
    const trend6ArrowCls = trend6Months > 0
      ? 'fa fa-play fa-rotate-270'
      : 'fa fa-play fa-rotate-90';

    return (
      <div>
        <PageHeading current={player.name} additional={topDetails} />
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
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-xs-6 col-lg-3">
                  <div className="ibox">
                    <div className="ibox-content dataPanel">
                      <h5 className="m-b-md">Value</h5>
                      <h2 className="text-success">
                        <i className="fa fa-tag"></i> {player[currentMonthValue]}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="col-xs-6 col-lg-3">
                  <div className="ibox">
                    <div className="ibox-content dataPanel ">
                      <h5 className="m-b-md">ADP</h5>
                      <h2 className={adpColorCls}>
                        <i className={adpArrowCls}></i> {player[currentMonthADP]}
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
              <div className="row">
                <div className="col-lg-12 graphContainer">
                  <ADPGraph players={[player]} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <SimilarPlayersTable similarPlayers={similarPlayers} currentPlayer={player} />
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
