import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Line } from 'react-peity';

const currentMonthADP = 'may_16';
const currentMonthValue = 'may_16_value'
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
  const ageDifMs = Date.now() - birthdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Player component - represents a Player profile
export default class SimilarPlayersTable extends Component {
  render() {
    if (!this.props.currentPlayer) {
      return null;
    }

    const currentPlayer = this.props.currentPlayer;
    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
            <h5>Similar Players </h5>
        </div>
        <div className="ibox-content">
            <table className="table table-hover">
                <thead>
                  <tr>
                      <th>Name</th>
                      <th>Position</th>
                      <th>ADP</th>
                      <th>6 Months</th>
                  </tr>
                </thead>
                <tbody>
                {this.props.similarPlayers && this.props.similarPlayers.map(function(player) {
                  const data = [];
                  for (var i=0; i<past6MonthsADP.length; i++) {
                    data.push(player[past6MonthsADP[i]] * -1);
                  }

                  const isPlayer = currentPlayer === player;
                  const isPlayerClass = isPlayer ? '#d9edf7' : '#ffffff';
                  const profileLink = `/players/${player._id._str}`;
                  return (
                        <tr className={classnames({ info: isPlayer })}>
                          <td><Link to={profileLink}>{player.name}</Link></td>
                          <td>{player.position}</td>
                          <td>{player[currentMonthADP]}</td>
                          <td>
                            <Line
                              values={data}
                              height="16"
                              min="-500"
                              max="-Infinity"
                              fill={isPlayerClass} />
                            </td>
                        </tr>
                      );
                }
                )}
                </tbody>
            </table>
        </div>
    </div>
    );
  }
}

SimilarPlayersTable.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  // player: PropTypes.object.isRequired,
  // sortGrp: PropTypes.string.isRequired,
};
