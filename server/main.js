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

// function cleanName(name) {
//   return name.replace(' Jr.', '').replace(/\./g, '');
// }
//
// const positions = ['QB', 'WR', 'RB', 'TE'];
//
// function updatePlayers() {
//   const options = {
//     uri: 'http://www03.myfantasyleague.com/2017/export?TYPE=players&DETAILS=1&JSON=1',
//   };
//
//   let n = 0;
//   rp(options).then(
//     Meteor.bindEnvironment(x => {
//       const players = JSON.parse(x).players.player.filter(y => positions.indexOf(y.position) > -1);
//       Meteor.call('players.getPlayers', (err, result) => {
//         result.forEach(p => {
//           if (p.position !== 'PICK') {
//             const newPlayer = p;
//             const match = players.find(z => parseInt(z.id) === parseInt(newPlayer.id));
//             if (match) {
//               n++;
//               newPlayer.birthdate = new Date(parseInt(match.birthdate) * 1000);
//               newPlayer.draft_year = match.draft_year;
//               newPlayer.nfl_id = match.nfl_id;
//               newPlayer.rotoworld_id = match.rotoworld_id;
//               newPlayer.stats_id = match.stats_id;
//               newPlayer.position = match.position;
//               newPlayer.stats_global_id = match.stats_global_id;
//               newPlayer.espn_id = match.espn_id;
//               newPlayer.kffl_id = match.kffl_id;
//               newPlayer.weight = match.weight;
//               newPlayer.draft_team = match.draft_team;
//               newPlayer.draft_pick = match.draft_pick;
//               newPlayer.college = match.college;
//               newPlayer.height = match.height;
//               newPlayer.jersey = match.jersey;
//               newPlayer.twitter_username = match.twitter_username;
//               newPlayer.sportsdata_id = match.sportsdata_id;
//               newPlayer.team = match.team;
//               newPlayer.cbs_id = match.cbs_id;
//             } else {
//               newPlayer.inactive = true;
//             }
//             Players.update({ id: newPlayer.id }, newPlayer);
//           }
//         });
//       });
//     })
//   );
// }
//
// // updatePlayers();
//
// function getFantasyProsRankings() {
//   const pickNames = [
//     ['2017 Pick 1']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 2']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 3']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 4']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 5']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 6']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 7']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 8']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 9']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 10']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 11']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 12']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 13']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 14']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 15']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 16']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 17']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 18']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 19']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 20']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 21']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 22']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 23']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 24']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 25']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 26']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 27']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 28']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 29']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 30']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 31']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 32']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 33']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 34']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 35']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 36']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 37']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 38']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 39']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 40']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 41']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 42']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 43']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 44']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 45']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 46']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 47']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Pick 48']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2017 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2017 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2017 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2017 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2018 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2018 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2018 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2018 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2019 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2019 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2019 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2019 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2020 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2020 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2020 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2020 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2021 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2021 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2021 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   [  '2021 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Early 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Early 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Early 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Early 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Early 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Early 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Early 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Early 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2019 Early 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2019 Early 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2019 Early 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2019 Early 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2020 Early 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2020 Early 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2020 Early 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2020 Early 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2021 Early 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2021 Early 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2021 Early 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2021 Early 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Mid 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Mid 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Mid 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Mid 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Mid 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Mid 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Mid 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Mid 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2019 Mid 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2019 Mid 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2019 Mid 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2019 Mid 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2020 Mid 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2020 Mid 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2020 Mid 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2020 Mid 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2021 Mid 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2021 Mid 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2021 Mid 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2021 Mid 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Late 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Late 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Late 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2017 Late 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Late 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Late 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Late 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Late 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2019 Late 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2019 Late 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2019 Late 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2019 Late 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2020 Late 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2020 Late 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2020 Late 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2020 Late 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2021 Late 1st']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2021 Late 2nd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2021 Late 3rd']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2021 Late 4th']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 1']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 2']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 3']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 4']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 5']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 6']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 7']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 8']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 9']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 10']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 11']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 12']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 13']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 14']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 15']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 16']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 17']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 18']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 19']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 20']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 21']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 22']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 23']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 24']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 25']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 26']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 27']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 28']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 29']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 30']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 31']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 32']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 33']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 34']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 35']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 36']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 37']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 38']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 39']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 40']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 41']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 42']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 43']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 44']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 45']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 46']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 47']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//     ['2018 Pick 48']: {
//       adp: (x) =>  ,
//       val: (x) => ,
//     },
//   ];
//
//   const options = {
//     uri: 'https://www.fantasypros.com/nfl/rankings/dynasty-overall.php',
//     transform(body) {
//       return cheerio.load(body);
//     },
//   };
//
//   rp(options)
//     .then(
//       Meteor.bindEnvironment(function ($) {
//         // Process html like you would with jQuery...
//         const raw = $('[class^="mpb-player"]');
//
//         const players = raw
//           .map((i, x) => {
//             const name = cleanName(x.children[2].children[0].children[0].data);
//             const best = parseInt(x.children[8].children[0].data);
//             const worst = parseInt(x.children[10].children[0].data);
//             const rank = parseFloat(x.children[12].children[0].data);
//             const stdev = parseFloat(x.children[14].children[0].data);
//             const pos = x.children[4].children[0].data;
//             const isQb = x.children[4].children[0].data.indexOf('QB') > -1;
//             const superScore = isQb ? rank - 35 : rank;
//             return {
//               name,
//               best,
//               worst,
//               rank,
//               stdev,
//               pos,
//               superScore,
//             };
//           })
//           .toArray();
//         const playersSuper = players.slice().sort((a, b) => a.superScore - b.superScore);
//         const playersFinal = playersSuper.map((x, i) => {
//           const obj = x;
//           obj.super = i + 1;
//           const diff = obj.super - obj.rank;
//           obj.stdev_2qb = stdev;
//           obj.best_2qb = best + diff;
//           obj.worst_2qb = best + diff;
//           return obj;
//         });
//         Meteor.call('players.getPlayers', (err, result) => {
//           playersFinal.forEach(player => {
//             const dbPlayer = result.find(x => x.name.toLowerCase() === player.name.toLowerCase());
//             if (dbPlayer) player.player = dbPlayer;
//             if (dbPlayer && dbPlayer.status === 'R') dbPlayer.isRookie = true;
//           });
//           const draftPicks = [];
//           pickNames.forEach(pick => {
//             const pickMatch = result.find(x => x.name === 'pick');
//             draftPicks.push(pickMatch);
//           });
//
//           const rookies = playersFinal.filter(x => x.isRookie);
//
//           // Get PPR values
//           for (var i = 0; i < draftPicks.length; i++) {
//             if (i < 49) {
//               draftPicks[i].rank = rookies[i].rank;
//             }
//           }
//
//           // 1-48 === rookies 1-48
//           //
//
//           result.forEach(p => {
//             if (p.position !== 'PICK') {
//               const newPlayer = p;
//               const match = playersFinal.find(
//                 x => x.name.toLowerCase() === newPlayer.name.toLowerCase()
//               );
//               const newRank = {};
//               newRank.time = new Date();
//               newRank.rank = match ? match.rank : null;
//               newRank.rank_2qb = match ? match.super : null;
//               newRank.redraft = newPlayer.rankings[0] ? newPlayer.rankings[0].redraft : null;
//               newRank.redraft_2qb = newPlayer.rankings[0]
//                 ? newPlayer.rankings[0].redraft_2qb
//                 : null;
//               newRank.buyindex = match && newPlayer.adp[0].adp
//                 ? newPlayer.adp[0].adp - match.rank
//                 : 0;
//               newRank.buyindex_2qb = match && newPlayer.adp[0].adp_2qb
//                 ? newPlayer.adp[0].adp_2qb - match.super
//                 : 0;
//               newRank.rookie = newPlayer.rankings[0].rookie;
//               newRank.rookie_2qb = newPlayer.rankings[0].rookie_2qb;
//               if (!newPlayer.rankings) newPlayer.rankings = [];
//               newPlayer.rankings.unshift(newRank);
//               Players.update({ id: newPlayer.id }, newPlayer);
//             }
//           });
//         });
//       })
//     )
//     .catch(
//       Meteor.bindEnvironment(function (err) {
//         // Crawling failed or Cheerio choked...
//         console.log(err, 'err');
//       })
//     );
// }
//
// getFantasyProsRankings();
//
// // const job1 = new cron.CronJob({
// //   // cronTime: '00 30 2 * * *',
// //   cronTime: '00 30 2 * * 3',
// //   onTick: Meteor.bindEnvironment(function () {
// //     getFantasyProsRankings();
// //   }),
// //   start: true,
// //   timeZone: 'America/Los_Angeles',
// // });
// //
// // const job2 = new cron.CronJob({
// //   // cronTime: '00 30 2 * * *',
// //   cronTime: '00 30 2 * * 2',
// //   onTick: Meteor.bindEnvironment(function () {
// //     updatePlayers();
// //   }),
// //   start: true,
// //   timeZone: 'America/Los_Angeles',
// // });

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
