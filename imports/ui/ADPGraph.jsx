import React, { Component, PropTypes } from 'react';
import ReactHighcharts from 'react-highcharts';
import PValues from './ADPConst.jsx';

// ADPGraph component - represents a ADPGraph profile
export default class ADPGraph extends Component {
  render() {
    const series = [];
    this.props.players.forEach(player => {
      const adpObj = {};
      const rangeObj = {};

      adpObj.name = `${player.name} ECR`;
      rangeObj.name = `Range`;
      adpObj.type = 'spline';
      rangeObj.type = 'arearange';

      adpObj.data = [];
      rangeObj.data = [];
      rangeObj.linkedTo = ':previous';
      rangeObj.fillOpacity = 0.3;

      const sortedPlayerData = [...player.adp].sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      );
      sortedPlayerData.forEach(data => {
        const x = data.time;
        adpObj.data.push([
          Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()),
          data[this.props.values.adpKey],
        ]);
        if (data[this.props.values.low] && data[this.props.values.low] && this.props.single) {
          rangeObj.data.push([
            Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()),
            data[this.props.values.low],
            data[this.props.values.high],
          ]);
        }
      });

      series.push(adpObj);
      series.push(rangeObj);

      // rankObj.data = [];
      // const key = this.props.values.rankKey;
      // if (player.rankings && this.props.single) {
      //   const sortedPlayerRankings = [...player.rankings].sort(
      //     (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      //   );
      //   sortedPlayerRankings.forEach(r => {
      //     const x = r.time;
      //     rankObj.data.push([Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()), r[key]]);
      //   });
      // }
      // series.push(rankObj);
    });

    const config = {
      chart: {
        backgroundColor: 'rgba(0,0,0,0)',
        type: 'areaspline',
        style: {
          fontFamily: 'open sans',
        },
      },
      title: {
        text: 'Average Draft Position',
      },
      colors: [
        'rgba(26,179,148,0.5)',
        '#1c84c6',
        '#23c6c8',
        '#f8ac59',
        '#ed5565',
        '#4719B3',
        '#B39419',
        '#1985B3',
        '#E0294E',
        '#1938B3',
      ],
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          // don't display the dummy year
          month: '%m-%Y',
        },
        title: {
          text: 'Date',
        },
      },
      series,
      yAxis: {
        reversed: true,
        title: {
          text: undefined,
        },
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: true,
          },
        },
      },
      tooltip: {
        valueDecimals: 1,
        crosshairs: true,
        shared: true,
      },
    };
    return (
      <div className="adpChart2-container">
        <div className="adpChart2">
          <ReactHighcharts config={config} className="adpChart-container" isPureConfig />
        </div>
      </div>
    );
  }
}

ADPGraph.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
};
