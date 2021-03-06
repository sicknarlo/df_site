import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Line } from 'react-chartjs';
// import ReactHighcharts from 'react-highcharts';
import ReactHighstock from 'react-highcharts/dist/ReactHighstock.src';

// TeamValueGraph component - represents a TeamValueGraph profile
export default class TeamValueGraph extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.team.players != nextProps.team.players) {
      return true;
    }
    return false;
  }

  render() {
    // const chartData = { name: this.props.team.name, data: [] };
    // for (var i = 0; i < 12; i++) {
    //   let val = 0;
    //   for (var g = 0; g < this.props.teamPlayers.length; g++) {
    //     if (
    //       this.props.teamPlayers[g].adp[i] &&
    //       this.props.teamPlayers[g].adp[i][this.props.values.valueKey]
    //     )
    //       val += this.props.teamPlayers[g].adp[i][this.props.values.valueKey];
    //   }
    //   chartData.data.push(val);
    // }

    // const config = {
    //   chart: {
    //     backgroundColor: 'rgba(0,0,0,0)',
    //     type: 'line',
    //     style: {
    //       fontFamily: 'open sans'
    //     }
    //   },
    //   title: {
    //     text: ''
    //   },
    //   colors: ['rgba(26,179,148,0.5)', '#1c84c6', '#23c6c8', '#f8ac59', '#ed5565'],
    //   xAxis: {
    //     categories: this.props.values.chartLabels
    //   },
    //   series: [chartData],
    //   yAxis: {
    //     title: {
    //       text: undefined
    //     }
    //   },
    //   plotOptions: {
    //     series: {
    //       compare: 'percent'
    //     }
    //   },
    //
    //   tooltip: {
    //     pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
    //     valueDecimals: 0
    //   }
    // };
    const data = this.props.team.values.map(tv => [
      Date.UTC(tv.date.getFullYear(), tv.date.getMonth(), tv.date.getDate()),
      tv.value,
    ]);

    const config2 = {
      rangeSelector: {
        selected: 1,
      },
      title: {
        text: 'Value',
      },
      series: [
        {
          name: 'Value',
          data,
          tooltip: {
            valueDecimals: 0,
          },
        },
      ],
    };

    return (
      <div className="adpChart2-container">
        <div className="adpChart2">
          <ReactHighstock config={config2} className="adpChart-container" />
          {/* <ReactHighcharts isPureConfig config={config} className="adpChart-container" /> */}
        </div>
      </div>
    );
  }
}

TeamValueGraph.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  // player: PropTypes.object.isRequired
};
