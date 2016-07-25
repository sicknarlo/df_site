import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/routes.jsx';
// import { CronJob } from 'node-cron';
import { Players } from '../imports/api/players.js';
import { Teams } from '../imports/api/teams.js';
import Values from '../imports/ui/ADPConst.jsx';
import '../imports/startup/accounts-config.js';
// import App from '../imports/ui/App.jsx';

const players = Players.find({}, { sort: { may_16: 1 } }).fetch();
const teams = Teams.find({});

Meteor.startup(() => {
  // job.start();
  render(renderRoutes(), document.getElementById('app'));
});
