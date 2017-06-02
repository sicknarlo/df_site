import React, { Component, PropTypes } from 'react';
import 'icheck/skins/all.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import $ from 'jquery';
import { Link } from 'react-router';
import PageHeading from './PageHeading.jsx';

export default class TradeFinder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playersToTrade: [],
    };

    this.logChange = this.logChange.bind(this);
    this.removePlayerFromCompare = this.removePlayerFromCompare.bind(this);
  }
  logChange(val) {
    if (this.state.playersToTrade.indexOf(val.val) > -1) {
      $('.compareSearch').addClass('has-error');
      setTimeout(function(){
        $('.compareSearch').removeClass('has-error');
      }, 1000);
    } else {
      $('.compareSearch').addClass('has-success');
      setTimeout(function(){
        $('.compareSearch').removeClass('has-success');
      }, 1000);
      const oldSet = this.state.playersToTrade;
      oldSet.push(val.val);
      this.setState({ playersToTrade: oldSet });
    }
  }

  removePlayerFromCompare(player) {
    const newState = { playersToTrade: this.state.playersToTrade };
    const index = newState.playersToTrade.indexOf(player);
    if (index > -1) {
      newState.playersToTrade.splice(index, 1);
      this.setState(newState);
    }
  }
  renderResults() {
    const variance = 0.15 + ((this.state.playersToTrade.length - 1) * 0.05);
    const topVariance = 0.15 - ((this.state.playersToTrade.length - 1) * 0.05);
    const valueSum = this.state.playersToTrade.reduce((arr, val) => arr + val.adp[0][this.props.values.valueKey], 0);
    const topRange = valueSum * (1 + topVariance);
    const bottomRange = valueSum * (1 - variance);
    const matches = this.props.players
      .filter(x =>
        x.adp[0][this.props.values.valueKey] < topRange && x.adp[0][this.props.values.valueKey] > bottomRange &&
        !this.state.playersToTrade.includes(x)
      )
      .slice()
      .sort((a, b) => b.adp[0][this.props.values.valueKey] - a.adp[0][this.props.values.valueKey]);
    return (
        <div>
            <div className="row playerRow">
              <div className="col-lg-12">
                <div className="ibox float-e-margins">
                  <div className="ibox-title">
                    <h5>Trade Targets</h5>
                  </div>
                  <div className="ibox-content">
                    <table className="table">
                      <thead>
                        <th>Player</th>
                        <th>Pos</th>
                        <th>ECR</th>
                        <th>Value</th>
                      </thead>
                      <tbody>
                        {matches && matches.map((player) =>
                          <tr>
                            <td>
                              <Link to={`/tools/players/${player._id._str}`}>{player.name}</Link>
                            </td>
                            <td>
                              {player.position}
                            </td>
                            <td>
                              {player.adp[0][this.props.values.adpKey]}
                            </td>
                            <td>
                              {player.adp[0][this.props.values.valueKey]}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
  }
  renderInstructions() {
    return (
      <div className="panel panel-info">
        <div className="panel-heading">
          <i className="fa fa-info-circle"></i> How to Use the Trade Wizard
        </div>
        <div className="panel-body">
          <p>The Trade Wizard helps you find your next big move. Add pieces you're willing to bundle and let the Trade Wizard find potential trade targets.</p>
          <strong>Credit to /u/solarpool for the original idea and help with implementation!</strong>
        </div>
      </div>
    );
  }

  render() {
    const options = this.props.players.map(function(player) {
      return { val: player, label: player.name }
    })
    return (
      <div>
        <PageHeading current="Trade Wizard" db={this.props.currentDb} />
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Add Players</h5><br />
                </div>
                <div className="ibox-content">
                  <form role="form" className="form-inline">
                    <div className="form-group compareSearch">
                    {this.props.players &&
                      <Select
                        name="form-field-name"
                        value="one"
                        options={options}
                        onChange={this.logChange}
                      />
                    }
                    </div>
                  </form>
                  {this.state.playersToTrade.length > 0 &&
                    <table className="table">
                      <thead>
                      </thead>
                      <tbody>
                        {this.state.playersToTrade.length > 0 && this.state.playersToTrade.map((player) =>
                          <tr className="removePlayerRow">
                            <td><Link to={`/tools/players/${player._id._str}`}>{player.name}</Link></td>
                            <td>
                              <div className="removePlayer" onClick={() => { this.removePlayerFromCompare(player); } }>
                                <i className="fa fa-times-circle-o"></i>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  }
                  <small>Total Players: {this.state.playersToTrade.length} | Package Value: {this.state.playersToTrade.reduce((arr, val) =>
                    arr + val.adp[0][this.props.values.valueKey], 0)
                  }</small>
                </div>
              </div>
            </div>
            <div className="col-md-8 col-sm-12">
              {this.state.playersToTrade.length > 0
                ? this.renderResults()
                : this.renderInstructions()}
            </div>
          </div>
          <div className="row">
          </div>
        </div>
      </div>
    );
  }
}

TradeFinder.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
