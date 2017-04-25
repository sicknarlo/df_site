import React, { Component, PropTypes } from 'react';
import 'icheck/skins/all.css';
import { Link } from 'react-router';

export default class DashboardLoggedIn extends Component {

  render() {
    if (!this.props.teamsReady) {
      return (
        <div className="sk-spinner sk-spinner-cube-grid">
            <div className="sk-cube"></div>
            <div className="sk-cube"></div>
            <div className="sk-cube"></div>
            <div className="sk-cube"></div>
            <div className="sk-cube"></div>
            <div className="sk-cube"></div>
            <div className="sk-cube"></div>
            <div className="sk-cube"></div>
            <div className="sk-cube"></div>
        </div>
      );
    }
    const user = this.props.currentUser;
    return (
      <div>
        <div className="row  border-bottom white-bg dashboard-header">
          <div className="col-sm-3">
            <h2>Welcome {user.username}</h2>
          </div>
        </div>
        <div className="col-sm-12">
          <div className="ibox">
            <div className="ibox-title">
              <h5>Your Teams</h5>
              <div className="ibox-tools">
                <Link to='/tools/createteam' className="btn btn-primary btn-xs"><i className="fa fa-plus"></i> Create new team</Link>
              </div>
            </div>
            <div className="ibox-content">
              <table className="table table-hover">
                <thead>
                  <th>Team Name</th>
                  <th># Teams</th>
                  <th># Assets</th>
                </thead>
                <tbody>
                  {this.props.teams && this.props.teams.map(function(t) {
                    const playerCount = t.players.length;
                    const isPPR = t.isPPR ? <span className='label label-warning'>PPR</span> : null;
                    const isIDP = t.isIDP ? <span className='label label-info'>IDP</span> : null;
                    const is2QB = t.is2QB ? <span className='label label-success'>2QB</span> : null;
                    return (
                      <tr>
                        <td>
                          <Link to={`/tools/teams/${t._id}`}>
                          {t.name}
                        </Link>
                      </td>
                      <td>
                        {t.teamCount}
                      </td>
                      <td>
                        {playerCount}
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-sm-12">
          <div className="ibox">
            <div className="ibox-title">
              <h5>Your Drafts</h5>
              <div className="ibox-tools">
                <Link to='/tools/draftmate/create' className="btn btn-primary btn-xs"><i className="fa fa-plus"></i> Draft Mate</Link>
              </div>
            </div>
            <div className="ibox-content">
              <table className="table table-hover">
                <thead>
                  <th>Draft Date</th>
                </thead>
                <tbody>
                  {this.props.drafts && this.props.teams.map(function(t) {
                    return (
                      <tr>
                        <td>
                          <Link to={`/tools/draftmate/${t._id}`}>
                            {t.date}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DashboardLoggedIn.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
};


{/*<div className="ibox-content no-padding">
  <ul className="list-group">
    {this.props.newsAlerts && this.props.newsAlerts.map(function(item) {
      const playerLink = item.player
        ? (
          <Link className="text-info" to={`/tools/players/${item.player._id._str}`}>
            @{item.player.name}&nbsp;
          </Link>)
        : <strong>General &nbsp;</strong>;
      return (
        <li className="list-group-item">
            <p>
              {playerLink}
              {$.parseHTML(item.content.content)[0].data}
            </p>
            <a href={item.content.link}><small className="block text-muted">Via Rotoworld</small></a>
        </li>
      )
    })}
</ul>
</div>*/}

// export default createContainer(() => {
//   const subscription = Meteor.subscribe('teams');
//   const loading = !subscription.ready();
//   const teams = Teams.find({}).fetch();
//   return {
//     loading,
//     teams,
//   };
// }, DashboardLoggedIn);