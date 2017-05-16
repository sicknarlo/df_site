import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Alert } from 'react-bootstrap';
import classnames from 'classnames';
import 'icheck/skins/all.css';

export default class UploadADP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      busy: false,
      success: false,
      username: '',
      password: '',
      franchise: '',
    };
    this.uploadAdp = this.uploadAdp.bind(this);
  }

  uploadAdp(e) {
    e.preventDefault();
    this.props.mixpanel.track('upload MFL draft list');
    this.setState({ busy: true });

    const args = {};
    args.username = this.refs.username.value;
    args.password = this.refs.password.value;
    args.franchise = this.refs.franchise.value;

    if (!args.username || !args.password || !args.franchise) return this.setState({ error: true, busy: false });
    args.players = '';
    this.props.players.slice().sort((a, b) => {
      if (a.adp[0][this.props.values.adpKey] > b.adp[0][this.props.values.adpKey]) {
        return 1;
      }
      if (a.adp[0][this.props.values.adpKey] < b.adp[0][this.props.values.adpKey]) {
        return -1;
      }
      // a must be equal to b
      return 0;
    }).forEach(val => {
      if (val.position !== 'PICK') args.players += `${val.id},`;
    });

    Meteor.call('adp.uploadAdpToMFL', args, (error, result) => {
      if (error) {
        console.log(error);
        this.setState({ error: true, busy: false });
      }
      if (result) {
        console.log(result);
        if (Object.keys(result).length) {
          this.setState({ success: true, busy: false });
        } else {
          this.setState({ error: true, busy: false });
        }
        this.refs.username.value = '';
        this.refs.password.value = '';
        this.refs.franchise.value = '';
      }
    });
  }

  render() {

    const error = (
      <Alert bsStyle="danger" onDismiss={() => this.setState({ error: false })}>
        <div className="row">
          <div className="col-lg-12">
            <h2>There was a problem. Check your username, password, and league ID and try again.</h2>
          </div>
        </div>
      </Alert>
    );

    const success = (
      <Alert bsStyle="success" onDismiss={() => this.setState({ success: false })}>
        <div className="row">
          <div className="col-lg-12">
            <h2>Success! Check your Draft List.</h2>
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
                      <h1>MFL ADP Upload</h1>
                  </div>
                  <div className="ibox-content">
                    <div className="text-center">
                      {this.state.error && error}
                      {this.state.success && success}
                      <h3>Use this tool to upload the latest ADP directly into your Draft List for your MFL Drafts!</h3>
                      <h3>Fill out the form below. The latest ADP will be uploaded into your Draft List. You can then add, remove, or rearrange the players however you want.</h3>
                    </div>
                    <hr />
                    <form method="get" className="form-horizontal">
                      <div className="form-group"><label className="col-sm-2 control-label">MFL Username</label>
                        <div className="col-sm-10"><input type="text" className="form-control" ref="username" /></div>
                      </div>
                      <div className="hr-line-dashed"></div>
                      <div className="form-group"><label className="col-sm-2 control-label">MFL Password</label>
                        <div className="col-sm-10"><input type="password" className="form-control" ref="password" /></div>
                      </div>
                      <div className="hr-line-dashed"></div>
                      <div className="form-group"><label className="col-sm-2 control-label">Mock Draft League ID</label>
                        <div className="col-sm-10"><input type="text" className="form-control" ref="franchise" /></div>
                      </div>
                      <div className="hr-line-dashed"></div>
                      <div className="form-group">
                        <div className="col-sm-4 col-sm-offset-2">
                          <button className="btn btn-primary" type="submit" onClick={this.uploadAdp}>Submit</button>
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

UploadADP.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};