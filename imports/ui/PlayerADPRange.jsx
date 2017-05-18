import React, { Component, PropTypes } from 'react';
import ReactHighcharts from 'react-highcharts';
import PValues from './ADPConst.jsx';

// ADPGraph component - represents a ADPGraph profile
export default class PlayerADPRange extends Component {

  render() {
    const series = [];
    this.props.players.forEach((player) => {
      const adpObj = {};

      adpObj.name = `${player.name} Vaue Range`;
      adpObj.type = 'areaspline';

      adpObj.data = [];

      const sortedPlayerData = [...player.adp].sort((a, b) =>
        new Date(a.time).getTime() - new Date(b.time).getTime());
        const low = player.adp[0].low;
        const high = player.adp[0].high;
        const stdev = player.adp[0].stdev;
        const adp = player.adp[0].adp;
        const stdevplus = adp + stdev > high ? high : adp + stdev;
        const stdevminus = adp - stdev < low || low === 1 ? low : adp - stdev;
        adpObj.data.push(
            [low, 0]
        )

        if (stdevminus !== low) {
            adpObj.data.push(
                [stdevminus, 1]
            )
        }
        adpObj.data.push(
            [adp, 2]
        )
        if (stdevplus !== high) {
            adpObj.data.push(
                [stdevplus, 1]
            )
        }
        adpObj.data.push(
            [high, 0]
        )
        series.push(adpObj);
    });


    const config = {
      chart: {
        backgroundColor: "rgba(0,0,0,0)",
        type: 'areaspline',
        style: {
          fontFamily: 'open sans',
        },
      },
      title: {
        text: 'Current Value Range',
      },
      colors: ['rgba(26,179,148,0.5)', '#1c84c6', '#23c6c8', '#f8ac59', '#ed5565', '#4719B3', '#B39419', '#1985B3', '#E0294E', '#1938B3'],
    //   xAxis: {
    //     type: 'datetime',
    //     dateTimeLabelFormats: { // don't display the dummy year
    //       month: '%m-%Y'
    //     },
    //     title: {
    //       text: 'Date'
    //     }
    //   },
      series,
      yAxis: {
        reversed: false,
        enabled: false,
        title: {
          text: undefined,
        }
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          }
        }
      },
      tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.x}</b><br/>',
          valueDecimals: 1,
      },
    };
    return (
      <div className="adpChart2-container">
        <div className="adpChart2">
          <ReactHighcharts config={config} className="adpChart-container" isPureConfig={true} />
        </div>
      </div>
    );
  }
}

PlayerADPRange.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
};
