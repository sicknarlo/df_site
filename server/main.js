import '../imports/api/players.js';
import '../imports/api/teams.js';
import '../imports/api/votes.js';
import '../imports/api/draftMateRankings.js';
import '../imports/api/drafts.js';
import '../imports/api/trades.js';
import '../imports/api/adp.js';
import '../imports/api/cache.js';
import { Players } from '../imports/api/players.js';
import { Meteor } from 'meteor/meteor';
import cron from 'cron';
import rp from 'request-promise';
import cheerio from 'cheerio';

function cleanName(name) {
  return name.replace(' Jr.', '').replace(/\./g, '');
}

const positions = ['QB', 'WR', 'RB', 'TE'];

function updatePlayers() {
  const options = {
    uri: 'http://www03.myfantasyleague.com/2017/export?TYPE=players&DETAILS=1&JSON=1',
  };

  let n = 0;
  rp(options).then(
    Meteor.bindEnvironment(x => {
      const players = JSON.parse(x).players.player.filter(y => positions.indexOf(y.position) > -1);
      Meteor.call('players.getPlayers', (err, result) => {
        result.forEach(p => {
          if (p.position !== 'PICK') {
            const newPlayer = p;
            const match = players.find(z => parseInt(z.id) === parseInt(newPlayer.id));
            if (match) {
              n++;
              newPlayer.birthdate = new Date(parseInt(match.birthdate) * 1000);
              newPlayer.draft_year = match.draft_year;
              newPlayer.nfl_id = match.nfl_id;
              newPlayer.rotoworld_id = match.rotoworld_id;
              newPlayer.stats_id = match.stats_id;
              newPlayer.position = match.position;
              newPlayer.stats_global_id = match.stats_global_id;
              newPlayer.espn_id = match.espn_id;
              newPlayer.kffl_id = match.kffl_id;
              newPlayer.weight = match.weight;
              newPlayer.draft_team = match.draft_team;
              newPlayer.draft_pick = match.draft_pick;
              newPlayer.college = match.college;
              newPlayer.height = match.height;
              newPlayer.jersey = match.jersey;
              newPlayer.twitter_username = match.twitter_username;
              newPlayer.sportsdata_id = match.sportsdata_id;
              newPlayer.team = match.team;
              newPlayer.cbs_id = match.cbs_id;
            } else {
              newPlayer.inactive = true;
            }
            Players.update({ id: newPlayer.id }, newPlayer);
          }
        });
      });
    })
  );
}

updatePlayers();

function getFantasyProsRankings() {
  const options = {
    uri: 'https://www.fantasypros.com/nfl/rankings/dynasty-overall.php',
    transform(body) {
      return cheerio.load(body);
    },
  };

  rp(options)
    .then(
      Meteor.bindEnvironment(function ($) {
        // Process html like you would with jQuery...
        const raw = $('[class^="mpb-player"]');
        const players = raw
          .map((i, x) => {
            const name = cleanName(x.children[2].children[0].children[0].data);
            const rank = x.children[0].children[0].data;
            const pos = x.children[4].children[0].data;
            const isQb = x.children[4].children[0].data.indexOf('QB') > -1;
            const superScore = isQb ? rank - 35 : rank;
            return {
              name,
              rank,
              pos,
              superScore,
            };
          })
          .toArray();

        const playersSuper = players.slice().sort((a, b) => a.superScore - b.superScore);
        const playersFinal = playersSuper.map((x, i) => {
          const obj = x;
          obj.super = i + 1;
          return obj;
        });
        Meteor.call('players.getPlayers', (err, result) => {
          result.forEach(p => {
            if (p.position !== 'PICK') {
              const newPlayer = p;
              const match = playersFinal.find(x => x.name === newPlayer.name);
              const newRank = {};
              newRank.time = new Date();
              newRank.rank = match ? match.rank : null;
              newRank.rank_2qb = match ? match.super : null;
              newRank.redraft = newPlayer.rankings[0] ? newPlayer.rankings[0].redraft : null;
              newRank.redraft_2qb = newPlayer.rankings[0]
                ? newPlayer.rankings[0].redraft_2qb
                : null;
              newRank.buyindex = match && newPlayer.adp[0].adp
                ? newPlayer.adp[0].adp - match.rank
                : 0;
              newRank.buyindex_2qb = match && newPlayer.adp[0].adp_2qb
                ? newPlayer.adp[0].adp_2qb - match.super
                : 0;
              newRank.rookie = newPlayer.rankings[0].rookie;
              newRank.rookie_2qb = newPlayer.rankings[0].rookie_2qb;
              if (!newPlayer.rankings) newPlayer.rankings = [];
              newPlayer.rankings.unshift(newRank);
              Players.update({ id: newPlayer.id }, newPlayer);
            }
          });
        });
      })
    )
    .catch(
      Meteor.bindEnvironment(function (err) {
        // Crawling failed or Cheerio choked...
        console.log(err, 'err');
      })
    );
}

const job1 = new cron.CronJob({
  // cronTime: '00 30 2 * * *',
  cronTime: '00 30 2 * * 3',
  onTick: Meteor.bindEnvironment(function () {
    getFantasyProsRankings();
  }),
  start: true,
  timeZone: 'America/Los_Angeles',
});

const job2 = new cron.CronJob({
  // cronTime: '00 30 2 * * *',
  cronTime: '00 30 2 * * 2',
  onTick: Meteor.bindEnvironment(function () {
    updatePlayers();
  }),
  start: true,
  timeZone: 'America/Los_Angeles',
});
