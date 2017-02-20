import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from 'react-sparklines';
import StatMedians from './StatMedians.jsx';

export default class PlayerStats extends Component {
  render() {
    const player = this.props.player;

    return (
      <div>
        <div className="row">
          Test
          <div className="col-lg-3 col-xs-6">
            <div className="ibox">
              <div className="ibox-content">
                <h5>Fantasy Points in 2016</h5>
                <h2>{player.fp_2016}</h2>
                <Sparklines
                  data={[player.fp_2014, player.fp_2015, player.fp_2016]}
                  min={Math.min(
                    StatMedians[player.position.toLowerCase() + '_fp'],
                    Math.min(player.fp_2014, player.fp_2015, player.fp_2016))}
                  max={Math.max(
                    StatMedians[player.position.toLowerCase() + '_fp'],
                    Math.max(player.fp_2014, player.fp_2015, player.fp_2016))}
                  limit={3}
                  width={100}
                  height={20}
                  margin={5}>
                  <SparklinesLine color="#1ab394" />
                  <SparklinesReferenceLine type="custom" value={StatMedians[player.position.toLowerCase() + '_fp']} />
                </Sparklines>
                <small>test</small>
                <small>test2</small>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-xs-6">
            <div className="ibox">
              <div className="ibox-content">
                <h5>Targets in 2016</h5>
                <h2>{player.targets_2016}</h2>
                <Sparklines
                  data={[player.targets_2014, player.targets_2015, player.targets_2016]}
                  min={Math.min(
                    StatMedians[player.position.toLowerCase() + '_targets'],
                    Math.min(player.targets_2014, player.targets_2015, player.targets_2016))}
                  max={Math.max(
                    StatMedians[player.position.toLowerCase() + '_targets'],
                    Math.max(player.targets_2014, player.targets_2015, player.targets_2016))}
                  limit={3}
                  width={100}
                  height={20}
                  margin={5}>
                  <SparklinesLine color="#1ab394" />
                  <SparklinesReferenceLine type="custom" value={StatMedians[player.position.toLowerCase() + '_targets']} />
                </Sparklines>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-xs-6">
            <div className="ibox">
              <div className="ibox-content">
                <h5>Receptions in 2016</h5>
                <h2>{player.rec_2016}</h2>
                <Sparklines
                  data={[player.rec_2014, player.rec_2015, player.rec_2016]}
                  min={Math.min(
                    StatMedians[player.position.toLowerCase() + '_rec'],
                    Math.min(player.rec_2014, player.rec_2015, player.rec_2016))}
                  max={Math.max(
                    StatMedians[player.position.toLowerCase() + '_rec'],
                    Math.max(player.rec_2014, player.rec_2015, player.rec_2016))}
                  limit={3}
                  width={100}
                  height={20}
                  margin={5}>
                  <SparklinesLine color="#1ab394" />
                  <SparklinesReferenceLine type="custom" value={StatMedians[player.position.toLowerCase() + '_rec']} />
                </Sparklines>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-xs-6">
            <div className="ibox">
              <div className="ibox-content">
                <h5>Reception Yards in 2016</h5>
                <h2>{player.rec_yards_2016}</h2>
                <Sparklines
                  data={[player.rec_yards_2014, player.rec_yards_2015, player.rec_yards_2016]}
                  min={Math.min(
                    StatMedians[player.position.toLowerCase() + '_rec_yards'],
                    Math.min(player.rec_yards_2014, player.rec_yards_2015, player.rec_yards_2016))}
                  max={Math.max(
                    StatMedians[player.position.toLowerCase() + '_rec_yards'],
                    Math.max(player.rec_yards_2014, player.rec_yards_2015, player.rec_yards_2016))}
                  limit={3}
                  width={100}
                  height={20}
                  margin={5}>
                  <SparklinesLine color="#1ab394" />
                  <SparklinesReferenceLine type="custom" value={StatMedians[player.position.toLowerCase() + '_rec_yards']} />
                </Sparklines>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-xs-6">
            <div className="ibox">
              <div className="ibox-content">
                <h5>Reception TDs in 2016</h5>
                <h2>{player.rec_td_2016}</h2>
                <Sparklines
                  data={[player.rec_td_2014, player.rec_td_2015, player.rec_td_2016]}
                  min={Math.min(
                    StatMedians[player.position.toLowerCase() + '_rec_td'],
                    Math.min(player.rec_td_2014, player.rec_td_2015, player.rec_td_2016))}
                  max={Math.max(
                    StatMedians[player.position.toLowerCase() + '_rec_td'],
                    Math.max(player.rec_td_2014, player.rec_td_2015, player.rec_td_2016))}
                  limit={3}
                  width={100}
                  height={20}
                  margin={5}>
                  <SparklinesLine color="#1ab394" />
                  <SparklinesReferenceLine type="custom" value={StatMedians[player.position.toLowerCase() + '_rec_td']} />
                </Sparklines>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-xs-6">
            <div className="ibox">
              <div className="ibox-content">
                <h5>Carries in 2016</h5>
                <h2>{player.rush_2016}</h2>
                <Sparklines
                  data={[player.rush_2014, player.rush_2015, player.rush_2016]}
                  min={Math.min(
                    StatMedians[player.position.toLowerCase() + '_rush'],
                    Math.min(player.rush_2014, player.rush_2015, player.rush_2016))}
                  max={Math.max(
                    StatMedians[player.position.toLowerCase() + '_rush'],
                    Math.max(player.rush_2014, player.rush_2015, player.rush_2016))}
                  limit={3}
                  width={100}
                  height={20}
                  margin={5}>
                  <SparklinesLine color="#1ab394" />
                  <SparklinesReferenceLine type="custom" value={StatMedians[player.position.toLowerCase() + '_rush']} />
                </Sparklines>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-xs-6">
            <div className="ibox">
              <div className="ibox-content">
                <h5>Rushing Yards in 2016</h5>
                <h2>{player.rush_yards_2016}</h2>
                <Sparklines
                  data={[player.rush_yards_2014, player.rush_yards_2015, player.rush_yards_2016]}
                  min={Math.min(
                    StatMedians[player.position.toLowerCase() + '_rush_yards'],
                    Math.min(player.rush_yards_2014, player.rush_yards_2015, player.rush_yards_2016))}
                  max={Math.max(
                    StatMedians[player.position.toLowerCase() + '_rush_yards'],
                    Math.max(player.rush_yards_2014, player.rush_yards_2015, player.rush_yards_2016))}
                  limit={3}
                  width={100}
                  height={20}
                  margin={5}>
                  <SparklinesLine color="#1ab394" />
                  <SparklinesReferenceLine type="custom" value={StatMedians[player.position.toLowerCase() + '_rush_yards']} />
                </Sparklines>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-xs-6">
            <div className="ibox">
              <div className="ibox-content">
                <h5>Rushing TDs in 2016</h5>
                <h2>{player.rush_td_2016}</h2>
                <Sparklines
                  data={[player.rush_td_2014, player.rush_td_2015, player.rush_td_2016]}
                  min={Math.min(
                    StatMedians[player.position.toLowerCase() + '_rush_td'],
                    Math.min(player.rush_td_2014, player.rush_td_2015, player.rush_td_2016))}
                  max={Math.max(
                    StatMedians[player.position.toLowerCase() + '_rush_td'],
                    Math.max(player.rush_td_2014, player.rush_td_2015, player.rush_td_2016))}
                  limit={3}
                  width={100}
                  height={20}
                  margin={5}>
                  <SparklinesLine color="#1ab394" />
                  <SparklinesReferenceLine type="custom" value={StatMedians[player.position.toLowerCase() + '_rush_td']} />
                </Sparklines>
              </div>
            </div>
          </div>
          {/* <div className="col-lg-3 col-xs-6">
            <div className="ibox">
              <div className="ibox-content">
                <h5>Fumbles in 2016</h5>
                <h2>{player.fumble_2016}</h2>
                <Sparklines
                  data={[player.fumble_2014, player.fumble_2015, player.fumble_2016]}
                  min={Math.min(
                    StatMedians[player.position.toLowerCase() + '_fumble'],
                    Math.min(player.fumble_2014, player.fumble_2015, player.fumble_2016))}
                  max={Math.max(
                    StatMedians[player.position.toLowerCase() + '_fumble'],
                    Math.max(player.fumble_2014, player.fumble_2015, player.fumble_2016))}
                  limit={3}
                  width={100}
                  height={20}
                  margin={5}>
                  <SparklinesLine color="#1ab394" />
                  <SparklinesReferenceLine type="custom" value={StatMedians[player.position.toLowerCase() + '_fumble']} />
                </Sparklines>
              </div>
            </div>
          </div> */}
        </div>
        <div className="row">
          <div className="col-lg-3 col-xs-6">
            <div className="ibox">
              <div className="ibox-content">
                <h5>Pass Attempts in 2016</h5>
                <h2>{player.pass_attempt_2016}</h2>
                <Sparklines
                  data={[player.pass_attempt_2014, player.pass_attempt_2015, player.pass_attempt_2016]}
                  min={Math.min(
                    StatMedians[player.position.toLowerCase() + '_pass_attempts'],
                    Math.min(player.pass_attempt_2014, player.pass_attempt_2015, player.pass_attempt_2016))}
                  max={Math.max(
                    StatMedians[player.position.toLowerCase() + '_pass_attempts'],
                    Math.max(player.pass_attempt_2014, player.pass_attempt_2015, player.pass_attempt_2016))}
                  limit={3}
                  width={100}
                  height={20}
                  margin={5}>
                  <SparklinesLine color="#1ab394" />
                  <SparklinesReferenceLine type="custom" value={StatMedians[player.position.toLowerCase() + '_pass_attempts']} />
                </Sparklines>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-xs-6">
            <div className="ibox">
              <div className="ibox-content">
                <h5>Completions in 2016</h5>
                <h2>{player.pass_completion_2016}</h2>
                <Sparklines
                  data={[player.pass_completion_2014, player.pass_completion_2015, player.pass_completion_2016]}
                  min={Math.min(
                    StatMedians[player.position.toLowerCase() + '_pass_completions'],
                    Math.min(player.pass_completion_2014, player.pass_completion_2015, player.pass_completion_2016))}
                  max={Math.max(
                    StatMedians[player.position.toLowerCase() + '_pass_completions'],
                    Math.max(player.pass_completion_2014, player.pass_completion_2015, player.pass_completion_2016))}
                  limit={3}
                  width={100}
                  height={20}
                  margin={5}>
                  <SparklinesLine color="#1ab394" />
                  <SparklinesReferenceLine type="custom" value={StatMedians[player.position.toLowerCase() + '_pass_completions']} />
                </Sparklines>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-xs-6">
            <div className="ibox">
              <div className="ibox-content">
                <h5>Pass Yards in 2016</h5>
                <h2>{player.pass_yards_2016}</h2>
                <Sparklines
                  data={[player.pass_yards_2014, player.pass_yards_2015, player.pass_yards_2016]}
                  min={Math.min(
                    StatMedians[player.position.toLowerCase() + '_pass_yards'],
                    Math.min(player.pass_yards_2014, player.pass_yards_2015, player.pass_yards_2016))}
                  max={Math.max(
                    StatMedians[player.position.toLowerCase() + '_pass_yards'],
                    Math.max(player.pass_yards_2014, player.pass_yards_2015, player.pass_yards_2016))}
                  limit={3}
                  width={100}
                  height={20}
                  margin={5}>
                  <SparklinesLine color="#1ab394" />
                  <SparklinesReferenceLine type="custom" value={StatMedians[player.position.toLowerCase() + '_pass_yards']} />
                </Sparklines>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-xs-6">
            <div className="ibox">
              <div className="ibox-content">
                <h5>Passing TDs in 2016</h5>
                <h2>{player.pass_td_2016}</h2>
                <Sparklines
                  data={[player.pass_td_2014, player.pass_td_2015, player.pass_td_2016]}
                  min={Math.min(
                    StatMedians[player.position.toLowerCase() + '_pass_td'],
                    Math.min(player.pass_td_2014, player.pass_td_2015, player.pass_td_2016))}
                  max={Math.max(
                    StatMedians[player.position.toLowerCase() + '_pass_td'],
                    Math.max(player.pass_td_2014, player.pass_td_2015, player.pass_td_2016))}
                  limit={3}
                  width={100}
                  height={20}
                  margin={5}>
                  <SparklinesLine color="#1ab394" />
                  <SparklinesReferenceLine type="custom" value={StatMedians[player.position.toLowerCase() + '_pass_td']} />
                </Sparklines>
              </div>
            </div>
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