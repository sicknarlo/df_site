import React, { Component, PropTypes } from 'react';
import ReactHighcharts from 'react-highcharts';
import PValues from './ADPConst.jsx';

// ADPGraph component - represents a ADPGraph profile
export default class AdvancedPlayerADPRange extends Component {
  render() {
    const series = [];
    const values = this.props.values;
    this.props.players.forEach(player => {
      const adpObj = {};

      adpObj.name = `${player.name} Vaue Range`;
      adpObj.type = 'areaspline';

      adpObj.data = [];
      const low = player.adp[0][values.low];
      const high = player.adp[0][values.high];
      const stdev = player.adp[0][values.stdev];
      const adp = player.adp[0][values.adpKey];
      const stdevplus = adp + stdev > high ? high : parseFloat((adp + stdev).toFixed(2));
      const stdevminus = adp - stdev < low || low === 1 ? low : parseFloat((adp - stdev).toFixed(2));
      adpObj.data.push([low, 0]);

      if (stdevminus !== low) {
        adpObj.data.push([stdevminus, 0.5]);
      }
      adpObj.data.push([adp, 1]);
      if (stdevplus !== high) {
        adpObj.data.push([stdevplus, 0.5]);
      }
      adpObj.data.push([high, 0]);
      series.push(adpObj);
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
        text: 'Current Value Range',
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
        plotLines: [
          {
            "value": this.props.players[0].adp[0][this.props.values.adpKey],
            "width": 2,
            "color": "#666",
            "zIndex": 10,
            "dashStyle": "Dash",
            "label": {
              "text": "avg",
              "rotation": 0,
              "align": "center",
              "x": 0,
              "y": -5,
              "style": {
                "fontSize": "10px"
              }
            }
          }
        ],
        plotBands: [
          {
            "from": this.props.players[0].adp[0][this.props.values.adpKey] - this.props.players[0].adp[0][this.props.values.stdev],
            "to": this.props.players[0].adp[0][this.props.values.adpKey] + this.props.players[0].adp[0][this.props.values.stdev],
            "color": "rgba(184,210,236,.3)",
            "zIndex": -1,
            label: {
                text: 'Fair Value',
                style: {
                    color: '#606060'
                }
            }
          },
          // {
          //   "from": this.props.players[0].adp[0][this.props.values.adpKey],
          //   "to": this.props.players[0].adp[0][this.props.values.adpKey] + this.props.players[0].adp[0][this.props.values.stdev],
          //   "color": "rgba(184,210,236,.3)",
          //   "zIndex": -1
          // },
          // {
          //   "from": -1.8520831491109,
          //   "to": 1.9575671712092,
          //   "color": "rgba(184,210,236,.1)",
          //   "zIndex": 0
          // },
          // {
          //   "from": -2.8044957291909,
          //   "to": 2.9099797512892,
          //   "color": "rgba(184,210,236,.1)",
          //   "zIndex": 0
          // }
        ]
      },
        // xAxis: {
        //   type: 'datetime',
        //   dateTimeLabelFormats: { // don't display the dummy year
        //     month: '%m-%Y'
        //   },
        //   title: {
        //     text: 'Date'
        //   }
        // },
      series,
      yAxis: {
        reversed: false,
        enabled: false,
        title: {
          text: "Confidence at Value",
        },
        labels: {
          enabled: false,
        }
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false,
          },
        },
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.x}</b><br/>',
        valueDecimals: 1,
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

AdvancedPlayerADPRange.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
};
