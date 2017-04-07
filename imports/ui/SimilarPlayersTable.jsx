import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Line } from 'react-peity';

const ageCalc = function(birthdate) {
  const ageDifMs = Date.now() - birthdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Player component - represents a Player profile
export default class SimilarPlayersTable extends Component {
  handlePlayerClick() {
    window.scrollTo(0, 0);
  }
  render() {
    if (!this.props.currentPlayer) {
      return null;
    }

    const that = this;

    const currentPlayer = this.props.currentPlayer;
    const values = this.props.values;
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
                  for (var i = 0; i < 6; i++) {
                    data.unshift(player.adp[i][values.adpKey] * -1);
                  }

                  const isPlayer = currentPlayer === player;
                  const isPlayerClass = isPlayer ? '#d9edf7' : '#ffffff';
                  const profileLink = `/tools/players/${player._id._str}`;
                  const nameLink = that.props.openPlayerViewer ?
                    <td><a data-value={player.id} onClick={that.props.openPlayerViewer}>{player.name}</a></td> :
                    <td><Link to={profileLink} onClick={that.handlePlayerClick}>{player.name}</Link></td>;
                  return (
                        <tr className={classnames({ info: isPlayer })}>
                          {nameLink}
                          <td>{player.position}</td>
                          <td>{player.adp[0][values.adpKey]}</td>
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
