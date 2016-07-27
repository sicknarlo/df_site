import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Line } from 'react-chartjs';
import ReactHighcharts from 'react-highcharts';
import Values from './ADPConst.jsx';

const currentMonthADP = Values.past6MonthsADP[5];
const currentMonthValue = Values.past6MonthsValue[5];
const chartLabels = Values.chartLabels;
const past6MonthsValue = Values.past6MonthsValue;
const past6MonthsADP = Values.past6MonthsADP;

// TeamValueGraph component - represents a TeamValueGraph profile
export default class TeamValueGraph extends Component {

  render() {
    const chartData = { name: this.props.team.name , data: [] };
    for (var i = 0; i<past6MonthsValue.length; i++) {
      let val = 0;
      for (var g=0; g<this.props.teamPlayers.length; g++) {
        val += this.props.teamPlayers[g][past6MonthsValue[i]];
      }
      chartData.data.push(val);
    }

    const config = {
      chart: {
        backgroundColor: "rgba(0,0,0,0)",
        type: 'line',
        style: {
          fontFamily: 'open sans',
        },
      },
      title: {
        text: '',
      },
      colors: ['rgba(26,179,148,0.5)', '#1c84c6', '#23c6c8', '#f8ac59', '#ed5565'],
      xAxis: {
        categories: chartLabels,
      },
      series: [chartData],
      yAxis: {
        title: {
          text: undefined,
        }
      },
      plotOptions: {
        series: {
          compare: 'percent'
        }
      },

      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
        valueDecimals: 0,
      },
    };
    return (
      <div className="adpChart">
        <ReactHighcharts isPureConfig config={config} isPureConfig className="adpChart-container" />
      </div>
    );
  }
}

TeamValueGraph.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
};
