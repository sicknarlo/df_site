import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Line } from 'react-chartjs';
import ReactHighcharts from 'react-highcharts';

// ADPGraph component - represents a ADPGraph profile
export default class TeamPositionBreakdown extends Component {

    shouldComponentUpdate (nextProps) {
        if (this.props.team.players != nextProps.team.players) {
            return true;
        }
        return false;
    }

  render() {

    let qbTotal = 0;
    let wrTotal = 0;
    let rbTotal = 0;
    let teTotal = 0;
    let pickTotal = 0;

    for (var i=0; i< this.props.teamPlayers.length; i++) {
      const p = this.props.teamPlayers[i];
      if (p.position === 'QB') {
        qbTotal += p[this.props.values.past6MonthsValue[5]]
      } else if (p.position === 'WR') {
        wrTotal += p[this.props.values.past6MonthsValue[5]]
      } else if (p.position === 'RB') {
        rbTotal += p[this.props.values.past6MonthsValue[5]]
      } else if (p.position === 'TE') {
        teTotal += p[this.props.values.past6MonthsValue[5]]
      } else if (p.position === 'PICK') {
        pickTotal += p[this.props.values.past6MonthsValue[5]]
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
        <ReactHighcharts isPureConfig config={config} className="adpChart-container" />
      </div>
    );
  }
}

TeamPositionBreakdown.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
};
