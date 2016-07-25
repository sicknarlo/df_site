import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import $ from 'jquery';
import { Link } from 'react-router';

import PlayerRow from './PlayerRow.jsx';
import PageHeading from './PageHeading.jsx';
import Values from './ADPConst.jsx';

const currentMonthADP = Values.past6MonthsADP[5];
const currentMonthValue = Values.past6MonthsValue[5];
const chartLabels = Values.chartLabels;
const past6MonthsValue = Values.past6MonthsValue;
const past6MonthsADP = Values.past6MonthsADP;

export default class UpdateValues extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    Meteor.call('teams.updateValues');
  }

  render() {
    return (
      <div>
        Howdy Howdy Howdy
      </div>
    );
  }
}

UpdateValues.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
