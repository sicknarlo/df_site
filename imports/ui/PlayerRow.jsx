import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';

function ageCalc(dateString) {
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

// Player component - represents a Player profile
export default class PlayerRow extends Component {
  render() {
    const player = this.props.player;
    const trend = player[this.props.values.trend3] || 0;
    const trendCls = classnames('hide-xs', 'playerCol', {
      trendDanger: trend < 0,
      trendPositive: trend > 0,
      sorted: this.props.sortGrp === 'sortByTrend',
    });
    const trendLabel = trend > 0 ? `+${trend}` : trend;
    const profileLink = `/tools/players/${player._id._str}`;
    return (
      <tr>
        <td className={classnames('playerCol', { sorted: this.props.sortGrp === 'sortByName' })}>
          <Link to={profileLink}>{player.name}</Link>
        </td>
        <td
          className={classnames('playerCol', { sorted: this.props.sortGrp === 'sortByPosition' })}
        >
          {player.position}
        </td>
        <td
          className={classnames('playerCol', 'hide-xs', {
            sorted: this.props.sortGrp === 'sortByAge',
          })}
        >
          {player.birthdate ? ageCalc(player.birthdate) : null}
        </td>
        {/* <td
            className={classnames('playerCol', { sorted: this.props.sortGrp === 'sortByRank' })}
          >
            {player.rankings && player.rankings[0][this.props.values.rankKey]}
          </td> */}
        <td className={classnames('playerCol', { sorted: this.props.sortGrp === 'sortByADP' })}>
          {player.adp[0][this.props.values.adpKey]}
        </td>
        <td className={trendCls}>
          {trendLabel}
        </td>
        <td
          className={classnames('hide-xs', 'playerCol', {
            sorted: this.props.sortGrp === 'sortByValue',
          })}
        >
          {player.adp[0][this.props.values.valueKey]}
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
