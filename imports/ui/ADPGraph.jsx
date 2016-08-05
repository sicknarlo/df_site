import React, { Component, PropTypes } from 'react';
import ReactHighcharts from 'react-highcharts';
import PValues from './ADPConst.jsx';

// ADPGraph component - represents a ADPGraph profile
export default class ADPGraph extends Component {

  render() {
    const datasets = this.props.players.map((player) => {
      const data = [];
      for (var i=0; i<this.props.values.chartLabels.length; i++) {
        data.push(
          player[this.props.values.past6MonthsADP[i]]
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
      colors: ['rgba(26,179,148,0.5)', '#1c84c6', '#23c6c8', '#f8ac59', '#ed5565', '#4719B3', '#B39419', '#1985B3', '#E0294E', '#1938B3'],
      xAxis: {
        categories: this.props.values.chartLabels,
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
