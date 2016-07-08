import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/routes.jsx';
// import { CronJob } from 'node-cron';
import { Players } from '../imports/api/players.js';
import { Teams } from '../imports/api/teams.js';
import Values from '../imports/ui/ADPConst.jsx';
var CronJob = require('cron').CronJob;
import '../imports/startup/accounts-config.js';
// import App from '../imports/ui/App.jsx';

const players = Players.find({}, { sort: { may_16: 1 } }).fetch();
const teams = Teams.find({});

var job = new CronJob({
  cronTime: '00 17 15 * * 0-6',
  onTick: function() {
    console.log('runnin!');
    teams.forEach(function(t) {
      const playerList = players.filter((p) => t.players.indexOf(p._id._str) > -1)
      let value = 0;
      for (var i=0; i<playerList.length; i++) {
        value += playerList[i][Values.past6MonthsValue[5]];
      }
      const oldValueList = t.values;
      const newValueList = t.values.push(value);
      Teams.update({_id : t._id}, { $set : {
        values: newValueList,
      } });
    });
    /*
     * Runs every weekday (Monday through Friday)
     * at 11:30:00 AM. It does not run on Saturday
     * or Sunday.
     */
  },
  start: true,
  timeZone: 'America/Los_Angeles',
});

Meteor.startup(() => {
  // job.start();
  render(renderRoutes(), document.getElementById('app'));
});
