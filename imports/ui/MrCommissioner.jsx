import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import request from 'request';
import cheerio from 'cheerio';
import 'icheck/skins/all.css';
import { Checkbox } from 'react-icheck';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import $ from 'jquery';
import { Link } from 'react-router';
import PageHeading from './PageHeading.jsx';
import ADPGraph from './ADPGraph.jsx';

export default class Compare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      league: {},
      leagueId: '143124',
      results: {},
      host: 'espn',
    };

    this.updateLeagueId = this.updateLeagueId.bind(this);
    this.scrapeLeague = this.scrapeLeague.bind(this);
    // this.removePlayerFromCompare = this.removePlayerFromCompare.bind(this);
  }
  updateLeagueId() {
    this.setState({ test: this.refs.leagueId.value });
  }
  scrapeLeague(e) {
    e.preventDefault();
    this.setState({ working: true });
    console.log('scrapin');
    if (this.state.host === "espn") {
      const url = `http://games.espn.com/ffl/schedule?leagueId=${this.state.leagueId}&seasonId=2016&teamId=0`;
      request(url, function(error, response, html){
        if (!error) {
          console.log('in');
          const $ = cheerio.load(html);
          const results = {};
          results.leageName = $('#content > div > div.gamesmain.container > div > div > div.games-fullcol.games-fullcol-extramargin > div.games-pageheader > div:nth-child(2) > h1').html();
          this.setState({ results });
          console.log(results);
        }
      })
    }
  }
  render() {
    return (
      <div>
        <div className="wrapper wrapper-content animated fadeInRight">
          <div className="row">
            <div className="col-sm-12">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h1>Mr Commissioner</h1>
                </div>
                <div className="ibox-content">
                  <form role="form" className="form-inline">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        ref="leagueId"
                        onChange={this.updateLeagueId} />
                      <div className="input-group-btn">
                        <button onClick={this.scrapeLeague} data-toggle="dropdown" className="btn btn-white dropdown-toggle" type="button" aria-expanded="false">Action <span className="caret"></span></button>
                        <ul className="dropdown-menu pull-right">
                            <li><a href="#">Action</a></li>
                            <li><a href="#">Another action</a></li>
                            <li><a href="#">Something else here</a></li>
                            <li className="divider"></li>
                            <li><a href="#">Separated link</a></li>
                        </ul>
                      </div>
                    </div>
                    <button onClick={this.scrapeLeague} type="button">Go</button>
                  </form>
                  {this.state.results.leagueName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
