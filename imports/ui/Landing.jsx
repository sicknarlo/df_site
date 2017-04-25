import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Link } from 'react-router';
import $ from 'jquery';

// Player component - represents a Player profile
export default class Landing extends Component {
  componentDidMount() {
    $('body').addClass('landing-page');
    $('body').attr('id', 'page-top');

    // Page scrolling feature
    $('a.page-scroll').bind('click', function(event) {
        var link = $(this);
        $('html, body').stop().animate({
            scrollTop: $(link.attr('href')).offset().top - 50
        }, 500);
        event.preventDefault();
        $("#navbar").collapse('hide');
    });

    var cbpAnimatedHeader = (function() {
        var docElem = document.documentElement,
            header = document.querySelector( '.navbar-default' ),
            didScroll = false,
            changeHeaderOn = 200;
        function init() {
            window.addEventListener( 'scroll', function( event ) {
                if( !didScroll ) {
                    didScroll = true;
                    setTimeout( scrollPage, 250 );
                }
            }, false );
        }
        function scrollPage() {
            var sy = scrollY();
            if ( sy >= changeHeaderOn ) {
                $(header).addClass('navbar-scroll')
            }
            else {
                $(header).removeClass('navbar-scroll')
            }
            didScroll = false;
        }
        function scrollY() {
            return window.pageYOffset || docElem.scrollTop;
        }
        init();

    })();

  }
  render() {
    return (
    <div>
      <div className="navbar-wrapper">
          <nav className="navbar navbar-default navbar-fixed-top navbar-landing" role="navigation">
              <div className="container landingNav">
                  <div className="navbar-header page-scroll">
                      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                          <span className="sr-only">Toggle navigation</span>
                          <span className="icon-bar"></span>
                          <span className="icon-bar"></span>
                          <span className="icon-bar"></span>
                      </button>
                      <a className="navbar-brand" href="#">DynastyFFTools</a>
                  </div>
                  <div id="navbar" className="navbar-collapse collapse">
                      <ul className="nav navbar-nav navbar-right">
                          <li><a className="page-scroll" href="/tools/dashboard">Dashboard</a></li>
                          <li><a className="page-scroll" href="/tools/calculator">Calculator</a></li>
                          <li><a className="page-scroll" href="/tools/players">Player List</a></li>
                          <li><a className="page-scroll" href="/tools/draftmate">Draft Mate</a></li>
                          <li><a className="page-scroll" href="https://medium.com/dynastyfftools">Blog</a></li>
                      </ul>
                  </div>
              </div>
          </nav>
      </div>
      <div id="inSlider" className="carousel carousel-fade" data-ride="carousel">
          <div className="carousel-inner" role="listbox">
              <div className="item active">
                  <div className="container">
                      <div className="carousel-caption">
                          <h1>Evaluate your trades.<br/>
                              Track your teams.<br/>
                              Win your leagues.</h1>
                          <p>Tools to help you win your dynasty fantasy football leagues.</p>
                          <p>
                              <a className="btn btn-lg btn-primary" href="/tools/dashboard" role="button">GET STARTED</a>
                          </p>
                      </div>
                      <div className="carousel-image wow zoomIn">
                          <img src="img/landing/devices.png" alt="devices" className="deviceImg"/>
                      </div>
                  </div>
                  <div className="header-back one"></div>

              </div>
          </div>
      </div>


      <section id="features" className="container services">
          <div className="row">
              <div className="col-sm-3">
                  <h2>Evaluate Trades</h2>
                  <p>Stop guessing. Use real average draft position data to make value-based trades and come out on top.</p>
                  <p><a className="navy-link" href="/tools/calculator" role="button">Evaluate a Trade &raquo;</a></p>
              </div>
              <div className="col-sm-3">
                  <h2>Draft Assistance</h2>
                  <p>Start-up or rookie, draft or auction -- the DynastyFF Tools Draft Mate is built for draft day.</p>
                  <p><a className="navy-link" href="/tools/draftmate" role="button">Draft Mate &raquo;</a></p>
              </div>
              <div className="col-sm-3">
                  <h2>Track Your Teams</h2>
                  <p>Add your teams. Track your players. Keep track of your moves. Right from your own dashboard.</p>
                  <p><a className="navy-link" href="/tools/dashboard" role="button">Go to the Dashboard &raquo;</a></p>
              </div>
              <div className="col-sm-3">
                  <h2>Free Forever</h2>
                  <p>We hate daily fantasy sports ads as much as you. No ads. No fees. Just awesome tools.</p>
                  <p><a className="navy-link" href="/tools/signup" role="button">Sign Up &raquo;</a></p>
              </div>
          </div>
      </section>

      <section  className="container features">
          <div className="row">
              <div className="col-lg-12 text-center">
                  <div className="navy-line"></div>
                  <h1>Lots of New Features<br/> <span className="navy"> and even more in the works</span> </h1>
              </div>
          </div>
          <div className="row">
              <div className="col-md-3 text-center wow fadeInLeft">
                  <div>
                      <i className="fa fa-calculator features-icon"></i>
                      <h2>Redesigned Calcualtor</h2>
                      <p>The trade calculator has been redesigned from the ground up to be more intuitive and easy to use as ever.</p>
                  </div>
                  <div className="m-t-lg">
                      <i className="fa fa-bar-chart features-icon"></i>
                      <h2>Team Portfolios</h2>
                      <p>Add all of your assets -- players and draft picks -- and track your team's value, along with your transactions, over time.</p>
                  </div>
              </div>
              <div className="col-md-6 text-center  wow zoomIn">
                  <img src="img/landing/devices.png" alt="dashboard" className="img-responsive" />
              </div>
              <div className="col-md-3 text-center wow fadeInRight">
                  <div>
                      <i className="fa fa-sitemap features-icon"></i>
                      <h2>Draft Mate</h2>
                      <p>The Draft Mate was designed to help players win from day one. With start up and rookie support, follow your draft real-time or run simulations.</p>
                  </div>
                  <div className="m-t-lg">
                      <i className="fa fa-rocket features-icon"></i>
                      <h2>More to Come</h2>
                      <p>New features are constantly being released, with many more on the roadmap.</p>
                  </div>
              </div>
          </div>
          <div className="row">
              <div className="col-lg-12 text-center">
                  <div className="navy-line"></div>
                  <h1>And best of all? It costs about free-fiddy</h1>
              </div>
          </div>
      </section>

      <section id="contact" className="gray-section contact">
          <div className="container">
              <div className="row m-b-lg">
                  <div className="col-lg-12 text-center">
                      <div className="navy-line"></div>
                      <h1>Contact Us</h1>
                      <p>These tools were built by dynasty owners, for dynasty owners. We are always looking to hear suggestons how we can improve what we have, or build what you want.</p>
                  </div>
              </div>
              <div className="row">
                  <div className="col-lg-12 text-center">
                      <a href="mailto:dynastyfftools@gmail.com" className="btn btn-primary">Send us mail</a>
                      <p className="m-t-sm">
                          Or find us through the internet tubes
                      </p>
                      <ul className="list-inline social-icon">
                          <li><a href="https://twitter.com/DynastyFFTools"><i className="fa fa-twitter"></i></a>
                          </li>
                          <li><a href="http://reddit.com/u/sicknarlo"><i className="fa fa-reddit"></i></a>
                          </li>
                      </ul>
                  </div>
              </div>
              <div className="row">
                  <div className="col-lg-8 col-lg-offset-2 text-center m-t-lg m-b-lg">
                      <p><strong>&copy; 2016 DynastyFF Tools</strong><br/></p>
                  </div>
              </div>
              <div className="row">
                  <div className="col-lg-8 col-lg-offset-2 text-center m-t-lg m-b-lg">
                      <a href="https://mixpanel.com/f/partner" rel="nofollow"><img src="//cdn.mxpnl.com/site_media/images/partner/badge_blue.png" alt="Mobile Analytics" /></a>
                  </div>
              </div>
          </div>
      </section>
    </div>);
  }
}
