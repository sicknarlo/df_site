import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import $ from 'jquery';
import { Link } from 'react-router';

import PlayerRow from './PlayerRow.jsx';
import PageHeading from './PageHeading.jsx';

const currentMonthADP = 'may_16';
const currentMonthValue = 'may_16_value';

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
