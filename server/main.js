import '../imports/api/players.js';
import '../imports/api/teams.js';
import '../imports/api/votes.js';
import '../imports/api/draftMateRankings.js';
import '../imports/api/drafts.js';
import '../imports/api/trades.js';
import '../imports/api/adp.js';
import '../imports/api/cache.js';
import { Meteor } from 'meteor/meteor';
import cron from 'cron';
import rp from 'request-promise';
import cheerio from 'cheerio';

Meteor.startup(() => {
  var options = {
    uri: 'https://www.fantasypros.com/nfl/rankings/dynasty-overall.php',
    transform: function (body) {
        return cheerio.load(body);
    }
  };

  rp(options)
      .then(function ($) {
          // Process html like you would with jQuery...
          const raw = $('[class^="player-label"]');
          const players = raw.slice(2, raw.length);
          console.log(players[0].children[0].children[0].data);
      })
      .catch(function (err) {
          // Crawling failed or Cheerio choked...
      });
  const job1 = new cron.CronJob({
    cronTime: '* * * * *',
    onTick: function() {
      console.log('job 1 ticked');
    },
    start: false,
    timeZone: 'America/Los_Angeles'
  });

  job1.start();
});
