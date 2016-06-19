import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Line } from 'react-chartjs';
import ReactHighcharts from 'react-highcharts';

const currentMonthADP = 'may_16';
const previousMonthADP = 'apr_16';
const currentMonthValue = 'may_16_value';
const chartLabels = [
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
];
const past6MonthsADP = [
  'nov_15',
  'dec_15',
  'jan_16',
  'feb_16',
  'mar_16',
  'apr_16',
  'may_16',
];

// ADPGraph component - represents a ADPGraph profile
export default class ADPGraph extends Component {

  render() {
    const datasets = this.props.players.map((player) => {
      const data = [];
      for (var i=0; i<chartLabels.length; i++) {
        data.push(
          player[past6MonthsADP[i]]
        )
      }
      return {
        name: player.name,
        data,
      }
    });
    const config = {
      chart: {
        backgroundColor: "rgba(0,0,0,0)",
        type: 'line',
        style: {
          fontFamily: 'open sans',
        },
      },
      title: {
        text: 'Average Draft Position',
      },
      colors: ['rgba(26,179,148,0.5)', '#1c84c6', '#23c6c8', '#f8ac59', '#ed5565'],
      xAxis: {
        categories: chartLabels,
      },
      series: datasets,
      yAxis: {
        reversed: true,
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
        valueDecimals: 1,
      },
    };
    return (
      <div className="adpChart">
        <ReactHighcharts config={config} className="adpChart-container" />
      </div>
    );
  }
}

ADPGraph.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
};
