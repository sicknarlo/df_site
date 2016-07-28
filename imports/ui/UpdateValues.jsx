import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import 'icheck/skins/all.css';

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
