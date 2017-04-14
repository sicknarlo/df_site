import React, { Component, PropTypes } from 'react';
import ReactHighcharts from 'react-highcharts';
import PValues from './ADPConst.jsx';

// ADPGraph component - represents a ADPGraph profile
export default class ADPGraph extends Component {

  render() {
    const series = [];
    this.props.players.forEach((player) => {
      const adpObj = {};
      const rankObj = {};

      adpObj.name = `${player.name} ADP`;
      rankObj.name = `${player.name} Rank`;
      adpObj.type = 'spline';
      rankObj.type = 'spline';

      adpObj.data = [];

      const sortedPlayerData = [...player.adp].sort((a, b) =>
        new Date(a.time).getTime() - new Date(b.time).getTime());
      sortedPlayerData.forEach(data => {
        const x = data.time;
        adpObj.data.push(
          [
            Date.UTC(x.getFullYear(),
            x.getMonth(),
            x.getDate()),
            data[this.props.values.adpKey]
          ]
        );
      });

      series.push(adpObj);

      rankObj.data = [];
      const key = this.props.isRookie ?
        'rookie' :
        this.props.values.rankKey;

      const sortedPlayerRankings = [...player.rankings].sort((a, b) =>
        new Date(a.time).getTime() - new Date(b.time).getTime());

      sortedPlayerRankings.forEach((r) => {
        const x = r.time;
        rankObj.data.push([
          Date.UTC(x.getFullYear(),
          x.getMonth(),
          x.getDate()),
          r[key],
        ]);
      });

      series.push(rankObj);
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
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
          month: '%m-%Y'
        },
        title: {
          text: 'Date'
        }
      },
      series,
      yAxis: {
        reversed: true,
        title: {
          text: undefined,
        }
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: true
          }
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
        valueDecimals: 1,
      },
    };
    return (
      <div className="adpChart">
        <ReactHighcharts config={config} className="adpChart-container" isPureConfig={true} />
      </div>
    );
  }
}

ADPGraph.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
};
