import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import $ from 'jquery';
import { Link } from 'react-router';
import PageHeading from './PageHeading.jsx';
import ADPGraph from './ADPGraph.jsx';

const ageCalc = function(birthdate) {
  const bdate = birthdate ? birthdate : 680000000;
  const ageDifMs = Date.now() - bdate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default class Compare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playersToCompare: [],
    };

    this.logChange = this.logChange.bind(this);
    this.removePlayerFromCompare = this.removePlayerFromCompare.bind(this);
  }
  logChange(val) {
    if (this.state.playersToCompare.indexOf(val.val) > -1) {
      $('.compareSearch').addClass('has-error');
      setTimeout(function(){
        $('.compareSearch').removeClass('has-error');
      }, 1000);
    } else {
      $('.compareSearch').addClass('has-success');
      setTimeout(function(){
        $('.compareSearch').removeClass('has-success');
      }, 1000);
      const oldSet = this.state.playersToCompare;
      oldSet.push(val.val);
      this.setState({ playersToCompare: oldSet });
    }
  }

  removePlayerFromCompare(player) {
    const newState = { playersToCompare: this.state.playersToCompare };
    const index = newState.playersToCompare.indexOf(player);
    if (index > -1) {
      newState.playersToCompare.splice(index, 1);
      this.setState(newState);
    }
  }
  renderResults() {
    return <ADPGraph players={this.state.playersToCompare} values={this.props.values} />
  }
  renderInstructions() {
    return (
      <div className="panel panel-info">
        <div className="panel-heading">
          <i className="fa fa-info-circle"></i> How to Use
        </div>
        <div className="panel-body">
          <p>Add players to compare. The results will show up here.</p>
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
        <PageHeading current="Player Comparison Tool" db={this.props.currentDb} />
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Add Players</h5>
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
                  {this.state.playersToCompare.length > 0 &&
                    <table className="table">
                      <thead>
                      </thead>
                      <tbody>
                        {this.state.playersToCompare.length > 0 && this.state.playersToCompare.map((player) =>
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
                </div>
              </div>
            </div>
            <div className="col-md-8 col-sm-12">
              {this.state.playersToCompare.length > 0
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

Compare.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
