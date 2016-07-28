import React, { Component, PropTypes } from 'react';
import ReactHighcharts from 'react-highcharts';
import PValues from './ADPConst.jsx';

// ADPGraph component - represents a ADPGraph profile
export default class ADPGraph extends Component {

  render() {
    const datasets = this.props.players.map((player) => {
      const data = [];
      for (var i=0; i<this.props.values.chartLabels.length; i++) {
        data.push(
          player[this.props.values.past6MonthsADP[i]]
        )
      }
      return {
        name: player.name,
        data,
      }
    });
    const config = {
      chart: {
        backgroundColor: "rgba(0,0,0,0)",
        type: 'line',
        style: {
          fontFamily: 'open sans',
        },
      },
      title: {
        text: 'Average Draft Position',
      },
      colors: ['rgba(26,179,148,0.5)', '#1c84c6', '#23c6c8', '#f8ac59', '#ed5565'],
      xAxis: {
        categories: this.props.values.chartLabels,
      },
      series: datasets,
      yAxis: {
        reversed: true,
        title: {
          text: undefined,
        }
      },
      plotOptions: {
        series: {
          compare: 'percent'
        }
      },

      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
        valueDecimals: 1,
      },
    };
    return (
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="contact-box">
                    <h2>What the heck is this all about?</h2>
                    <p>DynastyFFTools.com started as a simple Excel trade calculator I built to help me get a quick and dirty evaluation on trade ideas.</p>
                </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="contact-box">
                    <h2>Where do your values come from?</h2>
                    <p>There are a lot of ways to define "value", but we like when people put their money where their mouth is. Our value comes aggregated ADP from mock drafts from some of the most trusted resources in the community.</p>
                </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="contact-box">
                    <h2>What is "ADP"?</h2>
                    <p>ADP stands for "average draft position". It is where the player is taken, on average, in mock drafts. That means that is generally where people are taking them, which roughly reflects their value relative to the rest of the options.</p>
                </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="contact-box">
                    <h2>Where do you get your ADP?</h2>
                    <p>Our ADP comes from a number of sources including <a href="www.dynastyleaguefootball.com">Dynasty League Football</a>, <a href="www.dynastynerds.com">Dynasty Nerds</a>, <a href="www.reddit.com/r/dynastyff">the Dynasty FF subreddit</a>, and wherever else we come across decent data each month.</p>
                </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="contact-box">
                    <h2>How often do you update?</h2>
                    <p>Our value updates are monthly. We'd love to do it more often, but unfortunately because our values are based on ADP, it takes about a month of mock drafts to reflect changes in the NFL.</p>
                </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="contact-box">
                    <h2>Do you support 2QB leagues?</h2>
                    <p>Yep! You can switch between PPR leagues and 2QB/PPR from the dashboard at any time. Plus, if you create a team and check off "2QB" it will automatically show and track that team with 2QB values.</p>
                </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="contact-box">
                    <h2>How do I track my teams?</h2>
                    <p>Tracking your teams is easy. Simply sign up, go to your dashboard, fill out the fields, and you're all set. To get the most use out of it, you want to make sure you add all of your assets -- including your draft picks through 2020. That way you can track and compare your team's value over time.</p>
                </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="contact-box">
                    <h2>How do I add/remove players?</h2>
                    <p>Changing your roster is done through transactions on your team page. This way you have a snapshot of every move you make, including the values of all the players at that time. This is set up to support additional features coming soon.</p>
                </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="contact-box">
                    <h2>What features are in development?</h2>
                    <p>The new site has set the groundwork for a lot more features. Check out <a href="www.medium.com/dynastyfftools">the blog</a> for updates on new stuff in the works.</p>
                </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="contact-box">
                    <h2>HALP! I FOUND SOMETHING BROKEN</h2>
                    <p><a href="www.reddit.com/u/sicknarlo">Shoot me a message on Reddit</a> if you find any bugs or have any suggestions.</p>
                </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="contact-box">
                    <h2>What resources do you recommend?</h2>
                    <p><a href="www.dynastyleaguefootball.com">Dynasty League Football</a> has great content and very trustworthy rankings. It is beyond worth the cost of a premium account.</p>
                    <p><a href="www.dynastynerds.com">Dynasty Nerds</a> has great written content as well, and their podcast is a must-listen for any dynasty players.</p>
                    <p><a href="www.reddit.com/r/dynastyff">The Dynasty FF subreddit</a> is an aweosme community with great resources and advice from some of the best minds in the game. There are some very smart people taking very different approaches to the game there -- it is a must use.</p>
                </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="contact-box">
                    <h2>I logged in and my teams are all gone!</h2>
                    <p>Unfortunately the team tracking features are in very early stages and as such are not very...stable. Be patient, this is a one man operation here.</p>
                </div>
            </div>
        </div>
      </div>
    );
  }
}