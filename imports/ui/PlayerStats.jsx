import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from 'react-sparklines';
import StatMedians from './StatMedians.jsx';
import ReactHighcharts from 'react-highcharts';

export default class PlayerStats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStat: 'fp',
    };

    this.updateSelectedStat = this.updateSelectedStat.bind(this);
  }

  updateSelectedStat(b) {
    this.setState({ selectedStat: b.target.value });
  }

  render() {
    const player = this.props.player;
    const selectedStat = this.state.selectedStat;

    const datasets = [
      {
        name: player.name,
        data: [
          player.stats['2014'][selectedStat],
          player.stats['2015'][selectedStat],
          player.stats['2016'][selectedStat],
        ]
      },
      {
        name: `${player.position}1 Median`,
        data: [
          StatMedians[selectedStat][player.position.toLowerCase()],
          StatMedians[selectedStat][player.position.toLowerCase()],
          StatMedians[selectedStat][player.position.toLowerCase()],
        ]
      },
      {
        name: `${player.position}2 Median`,
        data: [
          StatMedians[selectedStat][player.position.toLowerCase() + '2'],
          StatMedians[selectedStat][player.position.toLowerCase() + '2'],
          StatMedians[selectedStat][player.position.toLowerCase() + '2'],
        ]
      }
    ]
    const config = {
      chart: {
        backgroundColor: "rgba(0,0,0,0)",
        type: 'line',
        style: {
          fontFamily: 'open sans',
        },
      },
      title: {
        text: selectedStat.title,
      },
      colors: ['rgba(26,179,148,0.5)', '#1c84c6', '#23c6c8', '#f8ac59', '#ed5565', '#4719B3', '#B39419', '#1985B3', '#E0294E', '#1938B3'],
      xAxis: {
        categories: [2014, 2015, 2016]
      },
      series: datasets,
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
        valueDecimals: 1,
      },
    };

    return (
      <div className="row playerRow">
        <div className="col-lg-12">
          <h1>Advanced Stats</h1>
          <select
            className="form-control m-b"
            name="account"
            value={selectedStat}
            onChange={this.updateSelectedStat}>
              <option value="fp">Fantasy Points</option>
              <option value="pass_attempts" >Pass Attempts</option>
              <option value="pass_completions" >Pass Completions</option>
              <option value="pass_yards" >Pass Yards</option>
              <option value="pass_td" >Pass TDs</option>
              <option value="int" >Interceptions</option>
              <option value="targets">Targets</option>
              <option value="rec">Receptions</option>
              <option value="rec_yards">Reception Yards</option>
              <option value="rec_td">Reception TDs</option>
              <option value="rush">Carries</option>
              <option value="rush_yards">Rushing Yards</option>
              <option value="rush_td">Rushing TDs</option>
              <option value="fumble">Fumbles</option>
          </select>
        </div>
        <div className="col-sm-4">
          <div className="ibox float-e-margins">
            <div className="ibox-title">
              <h5>2014</h5>
            </div>
          <div className="ibox-content">
            <h1 className="no-margins">{player.stats['2014'][selectedStat]}</h1>
            <div className={
              (player.stats['2014'][selectedStat] / StatMedians[selectedStat][player.position.toLowerCase()])
               * 100 > 99 ? 'stat-percent font-bold text-success' : 'stat-percent font-bold text-danger'
            }>
              {
                ((player.stats['2014'][selectedStat] / StatMedians[selectedStat][player.position.toLowerCase()])
                 * 100).toFixed(0)
              }%
            </div>
            <small>{player.position}1 Median</small>
          </div>
        </div>
      </div>
      <div className="col-sm-4">
        <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h5>2015</h5>
          </div>
        <div className="ibox-content">
          <h1 className="no-margins">{player.stats['2015'][selectedStat]}</h1>
          <div className={
            (player.stats['2015'][selectedStat] / StatMedians[selectedStat][player.position.toLowerCase()])
             * 100 > 99 ? 'stat-percent font-bold text-success' : 'stat-percent font-bold text-danger'
          }>
            {
              ((player.stats['2015'][selectedStat] / StatMedians[selectedStat][player.position.toLowerCase()])
               * 100).toFixed(0)
            }%
          </div>
          <small>{player.position}1 Median</small>
        </div>
      </div>
    </div>
    <div className="col-sm-4">
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <h5>2016</h5>
        </div>
      <div className="ibox-content">
        <h1 className="no-margins">{player.stats['2016'][selectedStat]}</h1>
        <div className={
          (player.stats['2016'][selectedStat] / StatMedians[selectedStat][player.position.toLowerCase()])
           * 100 > 99 ? 'stat-percent font-bold text-success' : 'stat-percent font-bold text-danger'
        }>
          {
            ((player.stats['2016'][selectedStat] / StatMedians[selectedStat][player.position.toLowerCase()])
             * 100).toFixed(0)
          }%
        </div>
        <small>{player.position}1 Median</small>
      </div>
    </div>
  </div>
  <div className="col-xs-12">
    <div className="adpChart">
      <ReactHighcharts config={config} className="adpChart-container" />
    </div>
  </div>
      </div>
    );
  }
}

PlayerStats.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  player: PropTypes.object.isRequired,
  sortGrp: PropTypes.string.isRequired,
};