import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Alert } from 'react-bootstrap';
import json2csv from 'json2csv';
import classnames from 'classnames';
import 'icheck/skins/all.css';

export default class AAVGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      busy: false,
      success: false,
      teamCount: 12,
      teamBudget: 100,
      is2qb: false,
    };
    this.downloadAAV = this.downloadAAV.bind(this);
    this.updateOption = this.updateOption.bind(this);
  }

  downloadAAV(e) {
    e.preventDefault();
    this.props.mixpanel.track('generate aav cheatsheat');
    this.setState({ busy: true });
    const budget = parseInt(this.state.teamBudget);
    const teamCount = parseInt(this.state.teamCount);
    const is2qb = this.state.is2qb;

    if (!budget || !teamCount) return this.setState({ busy: false, error: true });

    var filename, link, d;
    const fields = ['name', 'position', 'aav'];

    let count = 0;
    const totalBudget = budget * teamCount;

    const data = [];

    const values = is2qb ?
      {
        adpKey: 'adp_2qb',
        aav: 'aav_2qb',
      } :
      {
        adpKey: 'adp',
        aav: 'aav',
      };

    this.props.players.slice().filter(x => x.position !== 'PICK').sort((a, b) => {
      if (a.adp[0][values.adpKey] > b.adp[0][values.adpKey]) {
        return 1;
      }
      if (a.adp[0][values.adpKey] < b.adp[0][values.adpKey]) {
        return -1;
      }
      // a must be equal to b
      return 0;
    }).some(p => {
      data.push({
        name: p.name,
        position: p.position,
        aav: `$${(p.adp[0][values.aav] * totalBudget).toFixed(0)}`,
      });
      count ++;
      if (count > 200) return true;
    });
    let result = null;
    try {
      result = json2csv({ data: data, fields: fields });
    } catch (err) {
      // Errors are thrown for bad options, or if the data is empty and no fields are provided.
      // Be sure to provide fields if it is possible that your data array will be empty.
      return this.setState({ busy: false, error: true });
    }
    if (result === null) return this.setState({ busy: false, error: true });

    filename = 'aav_export.csv';

    if (!result.match(/^data:text\/csv/i)) {
       result = 'data:text/csv;charset=utf-8,' + result;
    }
    d = encodeURI(result);

    link = document.createElement('a');
    link.setAttribute('href', d);
    link.setAttribute('download', filename);
    link.click();
    return this.setState({ busy: false, success: true });
  }

  updateOption(e) {
    const newstate = this.state;
    newstate[e.target.name] = e.target.value;
    this.setState({ newstate });
  }

  render() {

    const error = (
      <Alert bsStyle="danger" onDismiss={() => this.setState({ error: false })}>
        <div className="row">
          <div className="col-lg-12">
            <h2>There was a problem. Make sure everything was filled out and try again.</h2>
          </div>
        </div>
      </Alert>
    );

    const success = (
      <Alert bsStyle="success" onDismiss={() => this.setState({ success: false })}>
        <div className="row">
          <div className="col-lg-12">
            <h2>Success! Your download should begin.</h2>
          </div>
        </div>
      </Alert>
    );

    const mainclasses = classnames('wrapper wrapper-content animated fadeInRight draftMate', {
      'sk-loading': this.state.busy,
    });

    return (
      <div className={mainclasses}>
        <div className="sk-spinner sk-spinner-wave">
          <div className="sk-rect1" />
          <div className="sk-rect2" />
          <div className="sk-rect3" />
          <div className="sk-rect4" />
          <div className="sk-rect5" />
        </div>
        <div className="row">
          <div className="col-xs-12">
              <div className="ibox float-e-margins">
                  <div className="ibox-title">
                      <h1>Auction Value Generator</h1>
                  </div>
                  <div className="ibox-content">
                    <div className="text-center">
                      {this.state.error && error}
                      {this.state.success && success}
                      <h3>Be prepared for your auction drafts. Download a CSV of league customized data-driven estimated auction values for draft day.</h3>
                      <h3>These values can be used during your auction to estimate how much players will go for and what you can expect to spend.</h3>
                    </div>
                    <hr />
                    <form method="get" className="form-horizontal">
                      <div className="form-group"><label className="col-sm-2 control-label">Number of Teams</label>
                        <div className="col-sm-10">
                          <input type="number"
                            name="teamCount"
                            className="form-control"
                            onChange={this.updateOption}
                            value={this.state.teamCount}
                          />
                        </div>
                      </div>
                      <div className="hr-line-dashed"></div>
                      <div className="form-group"><label className="col-sm-2 control-label">Your Team's Budget</label>
                      <div className="col-sm-10">
                        <input type="number"
                          name="teamBudget"
                          className="form-control"
                          onChange={this.updateOption}
                          value={this.state.teamBudget}
                        />
                      </div>
                      </div>
                      <div className="hr-line-dashed"></div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">2QB League</label>
                        <div className="col-sm-10">
                          <select
                            className="form-control m-b"
                            name="is2qb"
                            onChange={this.updateOption}
                            value={this.state.is2qb}
                          >
                              <option value={false}>No</option>
                              <option value={true}>Yes</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-4 col-sm-offset-2">
                          <button className="btn btn-primary" type="submit" onClick={this.downloadAAV}>Generate AAV</button>
                        </div>
                      </div>
                    </form>
                  </div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

AAVGenerator.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};