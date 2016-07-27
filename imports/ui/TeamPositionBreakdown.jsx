import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Line } from 'react-chartjs';
import ReactHighcharts from 'react-highcharts';
import Values from './ADPConst.jsx';

const currentMonthADP = Values.past6MonthsADP[5];
const currentMonthValue = Values.past6MonthsValue[5];
// ADPGraph component - represents a ADPGraph profile
export default class TeamPositionBreakdown extends Component {

  render() {

    let qbTotal = 0;
    let wrTotal = 0;
    let rbTotal = 0;
    let teTotal = 0;
    let pickTotal = 0;

    for (var i=0; i< this.props.teamPlayers.length; i++) {
      const p = this.props.teamPlayers[i];
      if (p.position === 'QB') {
        qbTotal += p[currentMonthValue]
      } else if (p.position === 'WR') {
        wrTotal += p[currentMonthValue]
      } else if (p.position === 'RB') {
        rbTotal += p[currentMonthValue]
      } else if (p.position === 'TE') {
        teTotal += p[currentMonthValue]
      } else if (p.position === 'PICK') {
        pickTotal += p[currentMonthValue]
      }
    }

    const sum = qbTotal + wrTotal + rbTotal + teTotal + pickTotal;

    const data = [{
        name: 'QB',
        y: parseInt(((qbTotal / sum) * 100).toFixed(2)),
    }, {
        name: 'WR',
        sliced: true,
        selected: true,
        y: parseInt(((wrTotal / sum) * 100).toFixed(2)),
    }, {
        name: 'RB',
        y: parseInt(((rbTotal / sum) * 100).toFixed(2)),
    }, {
        name: 'TE',
        y: parseInt(((teTotal / sum) * 100).toFixed(2)),
    }, {
        name: 'Draft Picks',
        y: parseInt(((pickTotal / sum) * 100).toFixed(2)),
    }];

    const pieData = [{
        name: 'Positions',
        colorByPoint: true,
        data: data
      }]

    console.log(pieData);

    const config = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
          text: 'Value Breakdown By Position'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                  style: {
                      color: (ReactHighcharts.theme && ReactHighcharts.theme.contrastTextColor) || 'black'
                  }
              }
          }
      },
      series: pieData,
      }
    return (
      <div className="adpChart">
        <ReactHighcharts isPureConfig config={config} isPureConfig className="adpChart-container" />
      </div>
    );
  }
}

TeamPositionBreakdown.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
};
