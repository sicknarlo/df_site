import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import $ from 'jquery';

import PlayerRow from './PlayerRow.jsx';
import PageHeading from './PageHeading.jsx';

const currentMonthADP = 'may_16';
const currentMonthValue = 'may_16_value';

const ageCalc = function(birthdate) {
  const bdate = birthdate ? birthdate : 680000000;
  const ageDifMs = Date.now() - bdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default class Dashboard extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     rotoData: null,
  //   };
  // }
  // componentWillMount() {
  //   const feed = 'http://www.rotoworld.com/rss/feed.aspx?sport=nfl&ftype=news&count=12&format=rss';
  //   const test = this
  //   $.ajax({
  //     url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(feed),
  //     dataType: 'json',
  //     context:
  //     success(data) {
  //       if (data.responseData.feed && data.responseData.feed.entries) {
  //         this.setState({ rotoData: data });
  //       }
  //     }
  //   }).bind(this);
  // }

  render() {
    return (
      <div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
