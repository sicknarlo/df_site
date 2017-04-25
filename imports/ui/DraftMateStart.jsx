import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';

export default class DraftMateStart extends Component {

  constructor(props) {
    super(props);
    this.goToDraftMate = this.goToDraftMate.bind(this);
  }

  goToDraftMate() {
    if (this.props.currentUser) {
      browserHistory.push('/tools/draftmate/create');
    } else {
      browserHistory.push('/tools/login');
    }
  }

  render() {
    return (
      <div>
        <div className="wrapper wrapper-content">
          <div className="row animated fadeInRight">
            <div className="col-xs-12">
              <div className="ibox float-e-margins">
                <section id="testimonials" className="navy-section testimonials" style={{ 'margin-top': '0' }}>
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12 text-center wow zoomIn animated" style={{ visibility: 'visible' }}>
                        <i className="fa fa-sitemap big-icon"></i>
                        <h1>
                          Draft Mate <br /><small>By DynastyFF Tools</small>
                        </h1>
                        <div>
                          The DynastyFF Tools Draft Mate is built to arm owners of all levels with the information they need to win on draft day.
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="container features">
                  <div className="row">
                    <div className="col-lg-12 text-center">
                      <div className="navy-line"></div>
                      <h1>Powered by over 30+ rankings<br /> <span className="navy"> from around the web</span> </h1>
                      <p>Rolling Aggregated Rankings (RAR) based on FantasyPros ECR help the consensus help you. </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 text-center">
                      <button className="btn btn-lg btn-info" onClick={this.goToDraftMate}>Start a Draft</button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 text-center wow fadeInLeft animated" style={{ visibility: 'visible', 'animation-name': 'fadeInLeft' }}>
                      <div>
                        <i className="fa fa-mobile text-success draftmateIcon"></i>
                        <h2>Mobile Friendly</h2>
                        <p>Leave the spreadsheet at home. Draft Mate is designed to be easy to use on a laptop or your cellphone.</p>
                      </div>
                      <div className="m-t-lg">
                        <i className="fa fa-gears text-success draftmateIcon"></i>
                        <h2>Custom Support</h2>
                        <p>Supports custom draft settings including league size, number of rounds, and both rookie and start up drafts.</p>
                      </div>
                    </div>
                    <div className="col-md-6 text-center wow fadeInRight animated" style={{ visibility: 'visible', 'animation-name': 'fadeInRight' }}>
                      <div>
                        <i className="fa fa-line-chart text-success draftmateIcon"></i>
                        <h2>Real-Time Insights</h2>
                        <p>The Draft Mate constantly compares aggregated ADP and aggregated rankings to help you draft the best player at any spot.</p>
                      </div>
                      <div className="m-t-lg">
                        <i className="fa fa-code-fork text-success draftmateIcon"></i>
                        <h2>Simulation Ready</h2>
                        <p>Powered by individual rankings from 30+ individuals on FantasyPros, Draft Mate can be used as a simulation tool to help you practice for the real thing.</p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 text-center">
                      <div className="navy-line"></div>
                      <h1>Draft Persistence Means You Draft on Your Schedule</h1>
                      <p>Drafts automatically save so Draft Mate can be used just as much for your slow e-mail drafts as your live ones. </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 text-center">
                      <button className="btn btn-lg btn-info" onClick={this.goToDraftMate}>Open Draft Mate</button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DraftMateStart.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  players: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  currentDb: PropTypes.string.isRequired,
};
