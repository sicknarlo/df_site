import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Link } from 'react-router';

function ageCalc(birthdate) {
  const ageDifMs = Date.now() - birthdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Player component - represents a Player profile
export default class PlayerRow extends Component {
  render() {
    const player = this.props.player;
    const trend = (player.adp[2][this.props.values.adpKey] - player.adp[0][this.props.values.adpKey]).toFixed(1);
    const trendCls = classnames('hide-xs', 'playerCol',
                                { trendDanger: trend < 0,
                                  trendPositive: trend > 0,
                                  sorted: this.props.sortGrp === 'sortByTrend' });
    const trendLabel = trend > 0 ? `+${trend}` : trend;
    const profileLink = `/tools/players/${player._id._str}`;
    return (
        <tr>
          <td
            className={classnames('playerCol', { sorted: this.props.sortGrp === 'sortByName' })}
          >
            <Link to={profileLink}>{player.name}</Link>
          </td>
          <td
            className={classnames('playerCol', { sorted: this.props.sortGrp === 'sortByPosition' })}
          >
            {player.position}
          </td>
          <td
            className={classnames('playerCol', 'hide-xs', { sorted: this.props.sortGrp === 'sortByAge' })}
          >
            {player.birthdate
              ? ageCalc(new Date(player.birthdate * 1000))
              : ageCalc(new Date(680000000 * 1000))
            }
          </td>
          <td
            className={classnames('playerCol', { sorted: this.props.sortGrp === 'sortByADP' })}
          >
            {player.adp[0][this.props.values.adpKey]}
          </td>
          <td
            className={trendCls}
          >
            {trendLabel}
          </td>
          <td
            className={classnames('hide-xs', 'playerCol', { sorted: this.props.sortGrp === 'sortByValue' })}
          >
            {player.rankings[0][this.props.values.valueKey]}
          </td>
        </tr>
    );
  }
}

PlayerRow.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
  sortGrp: PropTypes.string.isRequired,
};
