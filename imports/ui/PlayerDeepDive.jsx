import React, { Component, PropTypes } from 'react';
import 'icheck/skins/all.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import $ from 'jquery';
import { Link } from 'react-router';
import PageHeading from './PageHeading.jsx';
import ADPGraph from './ADPGraph.jsx';
import AdvancedPlayerADPRange from './AdvancedPlayerADPRange.jsx';

export default class PlayerDeepDive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: this.props.players[17],
    };

    // this.logChange = this.logChange.bind(this);
    // this.removePlayerFromCompare = this.removePlayerFromCompare.bind(this);
  }
  // logChange(val) {
  //   if (this.state.playersToCompare.indexOf(val.val) > -1) {
  //     $('.compareSearch').addClass('has-error');
  //     setTimeout(function(){
  //       $('.compareSearch').removeClass('has-error');
  //     }, 1000);
  //   } else {
  //     $('.compareSearch').addClass('has-success');
  //     setTimeout(function(){
  //       $('.compareSearch').removeClass('has-success');
  //     }, 1000);
  //     const oldSet = this.state.playersToCompare;
  //     oldSet.push(val.val);
  //     this.setState({ playersToCompare: oldSet });
  //   }
  // }

  // removePlayerFromCompare(player) {
  //   const newState = { playersToCompare: this.state.playersToCompare };
  //   const index = newState.playersToCompare.indexOf(player);
  //   if (index > -1) {
  //     newState.playersToCompare.splice(index, 1);
  //     this.setState(newState);
  //   }
  // }

  render() {
    const options = this.props.players.map(function(player) {
      return { val: player, label: player.name }
    })
    return (
      <div>
        <PageHeading current="Player Deep Dive" db={this.props.currentDb} />
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-sm-12">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Add Players</h5>
                </div>
                <div className="ibox-content">
                  <AdvancedPlayerADPRange players={[this.state.player]} values={this.props.values} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
          </div>
        </div>
      </div>
    );
  }
}

PlayerDeepDive.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};
