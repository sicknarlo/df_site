import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Line } from 'react-chartjs';
import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';
import Highlight from 'react-highlight';
import Values from './ADPConst.jsx';

const currentMonthADP = Values.past6MonthsADP[5];
const currentMonthValue = Values.past6MonthsValue[5];
const chartLabels = Values.chartLabels;
const past6MonthsValue = Values.past6MonthsValue;
const past6MonthsADP = Values.past6MonthsADP;

// PositionWebGraph component - represents a PositionWebGraph profile
export default class PositionWebGraph extends Component {

  render() {
    // const chartData = { name: this.props.team.name , data: [] };
    // for (var i = 0; i<past6MonthsValue.length; i++) {
    //   let val = 0;
    //   for (var g=0; g<this.props.team.players.length; g++) {
    //     val += this.props.team.players[g][past6MonthsValue[i]];
    //   }
    //   chartData.data.push(val);
    // }
    // console.log(chartData);

    var config = {
      chart: {
        polar: true
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
      }]
    };

    return (
      <div className="adpChart">
        <ReactHighcharts isPureConfig config={config} className="adpChart-container" />
      </div>
    );
  }
}

PositionWebGraph.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
};
