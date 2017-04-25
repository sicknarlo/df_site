import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import $ from 'jquery';
import { Link } from 'react-router';
import PlayerRow from './PlayerRow.jsx';
import PageHeading from './PageHeading.jsx';

export default class ActivityStream extends Component {

  render() {
    const players = this.props.players;
    const filteredData = this.props.rotoData.filter((item) => {
      const player = players.find((p) => p.rotoworld_id === parseInt(item.pid));
      return player != null && player != undefined;
    })
    const data = filteredData.map((item) => {
      const player = players.find((p) => p.rotoworld_id === parseInt(item.pid));
      const newItem = item;
      player ? newItem.player = player : newItem.player = null;
      newItem.imgLoc = !newItem.player
        ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'
        : `http://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${newItem.player.espn_id}.png&w=350&h=254`;
      return newItem;
    })
    return (
      <div className="row">
        <div className="col-xs-12">
            <div className="ibox float-e-margins">
                <div className="ibox-title">
                    <h5>Player News</h5>
                    <div className="ibox-tools">
                        <span className="label label-warning-light pull-right">{`${data.length} Alerts`}</span>
                    </div>
                </div>
                <div className="ibox-content">
                  <div>
                    <div className="feed-activity-list">
                      {data && data.map((item) => (
                        <div className="feed-element">
                          <a href="#" className="pull-left">
                            <img alt="image" className="img-circle" src={item.imgLoc} />
                          </a>
                          <div className="media-body ">
                              <strong><Link to={`/tools/players/${item.player._id._str}`}>{item.player.name}</Link></strong> {item.title} <br/>
                              <small className="text-muted"><a href={item.link}>via rotoworld</a></small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </div>
    );
  }
}

ActivityStream.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};