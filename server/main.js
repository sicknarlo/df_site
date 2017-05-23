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

function standardDeviation(values) {
  var avg = average(values);

  var squareDiffs = values.map(function (value) {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = parseFloat(Math.sqrt(avgSquareDiff).toFixed(2));
  return stdDev;
}

function average(data) {
  var sum = data.reduce(function (sum, value) {
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}

function getFantasyProsRankings() {
  const draftYears = ['2017', '2018', '2019', '2020', '2021'];

  const options = {
    uri: 'https://www.fantasypros.com/nfl/rankings/dynasty-overall.php',
    transform(body) {
      return cheerio.load(body);
    },
  };

  const options2 = {
    uri: 'http://www03.myfantasyleague.com/2017/export?TYPE=aav&JSON=1',
  };

  const aav_raw = [
    {
      auctionsSelectedIn: '52',
      id: '11192',
      averageValue: '28.90',
    },
    {
      auctionsSelectedIn: '62',
      id: '9988',
      averageValue: '28.30',
    },
    {
      auctionsSelectedIn: '44',
      id: '12652',
      averageValue: '26.43',
    },
    {
      auctionsSelectedIn: '54',
      id: '10271',
      averageValue: '26.38',
    },
    {
      auctionsSelectedIn: '44',
      id: '12175',
      averageValue: '26.05',
    },
    {
      auctionsSelectedIn: '31',
      id: '13153',
      averageValue: '22.68',
    },
    {
      auctionsSelectedIn: '48',
      id: '12150',
      averageValue: '21.64',
    },
    {
      auctionsSelectedIn: '1',
      id: '13242',
      averageValue: '21.51',
    },
    {
      auctionsSelectedIn: '33',
      id: '13129',
      averageValue: '21.44',
    },
    {
      auctionsSelectedIn: '48',
      id: '12151',
      averageValue: '21.34',
    },
    {
      auctionsSelectedIn: '22',
      id: '12721',
      averageValue: '21.20',
    },
    {
      auctionsSelectedIn: '61',
      id: '10261',
      averageValue: '20.98',
    },
    {
      auctionsSelectedIn: '45',
      id: '12140',
      averageValue: '20.92',
    },
    {
      auctionsSelectedIn: '62',
      id: '10695',
      averageValue: '20.80',
    },
    {
      auctionsSelectedIn: '32',
      id: '13130',
      averageValue: '20.03',
    },
    {
      auctionsSelectedIn: '57',
      id: '11232',
      averageValue: '19.92',
    },
    {
      auctionsSelectedIn: '55',
      id: '11644',
      averageValue: '19.86',
    },
    {
      auctionsSelectedIn: '55',
      id: '11660',
      averageValue: '19.55',
    },
    {
      auctionsSelectedIn: '45',
      id: '12634',
      averageValue: '19.54',
    },
    {
      auctionsSelectedIn: '53',
      id: '10729',
      averageValue: '19.03',
    },
    {
      auctionsSelectedIn: '32',
      id: '13131',
      averageValue: '19.01',
    },
    {
      auctionsSelectedIn: '57',
      id: '7836',
      averageValue: '18.51',
    },
    {
      auctionsSelectedIn: '55',
      id: '11678',
      averageValue: '17.95',
    },
    {
      auctionsSelectedIn: '50',
      id: '11674',
      averageValue: '17.57',
    },
    {
      auctionsSelectedIn: '51',
      id: '12620',
      averageValue: '16.75',
    },
    {
      auctionsSelectedIn: '44',
      id: '12171',
      averageValue: '16.08',
    },
    {
      auctionsSelectedIn: '55',
      id: '11670',
      averageValue: '16.01',
    },
    {
      auctionsSelectedIn: '61',
      id: '9823',
      averageValue: '15.75',
    },
    {
      auctionsSelectedIn: '48',
      id: '12141',
      averageValue: '15.67',
    },
    {
      auctionsSelectedIn: '43',
      id: '12625',
      averageValue: '15.35',
    },
    {
      auctionsSelectedIn: '57',
      id: '11680',
      averageValue: '14.92',
    },
    {
      auctionsSelectedIn: '62',
      id: '9902',
      averageValue: '14.79',
    },
    {
      auctionsSelectedIn: '62',
      id: '10273',
      averageValue: '14.74',
    },
    {
      auctionsSelectedIn: '46',
      id: '12154',
      averageValue: '14.71',
    },
    {
      auctionsSelectedIn: '3',
      id: '12019',
      averageValue: '14.44',
    },
    {
      auctionsSelectedIn: '42',
      id: '12646',
      averageValue: '14.34',
    },
    {
      auctionsSelectedIn: '32',
      id: '10506',
      averageValue: '14.30',
    },
    {
      auctionsSelectedIn: '34',
      id: '13128',
      averageValue: '14.22',
    },
    {
      auctionsSelectedIn: '60',
      id: '11222',
      averageValue: '14.15',
    },
    {
      auctionsSelectedIn: '55',
      id: '11679',
      averageValue: '14.14',
    },
    {
      auctionsSelectedIn: '60',
      id: '10722',
      averageValue: '13.59',
    },
    {
      auctionsSelectedIn: '63',
      id: '10703',
      averageValue: '13.51',
    },
    {
      auctionsSelectedIn: '31',
      id: '13154',
      averageValue: '13.43',
    },
    {
      auctionsSelectedIn: '55',
      id: '11244',
      averageValue: '13.38',
    },
    {
      auctionsSelectedIn: '62',
      id: '9099',
      averageValue: '13.19',
    },
    {
      auctionsSelectedIn: '51',
      id: '11671',
      averageValue: '13.17',
    },
    {
      auctionsSelectedIn: '68',
      id: '9448',
      averageValue: '13.17',
    },
    {
      auctionsSelectedIn: '30',
      id: '9307',
      averageValue: '12.91',
    },
    {
      auctionsSelectedIn: '6',
      id: '13260',
      averageValue: '12.89',
    },
    {
      auctionsSelectedIn: '65',
      id: '9118',
      averageValue: '12.53',
    },
    {
      auctionsSelectedIn: '60',
      id: '11248',
      averageValue: '12.27',
    },
    {
      auctionsSelectedIn: '63',
      id: '10708',
      averageValue: '12.19',
    },
    {
      auctionsSelectedIn: '58',
      id: '10700',
      averageValue: '11.94',
    },
    {
      auctionsSelectedIn: '48',
      id: '12610',
      averageValue: '11.86',
    },
    {
      auctionsSelectedIn: '53',
      id: '11657',
      averageValue: '11.83',
    },
    {
      auctionsSelectedIn: '43',
      id: '12626',
      averageValue: '11.60',
    },
    {
      auctionsSelectedIn: '61',
      id: '11675',
      averageValue: '11.33',
    },
    {
      auctionsSelectedIn: '2',
      id: '12359',
      averageValue: '11.33',
    },
    {
      auctionsSelectedIn: '12',
      id: '8851',
      averageValue: '11.10',
    },
    {
      auctionsSelectedIn: '50',
      id: '12186',
      averageValue: '11.08',
    },
    {
      auctionsSelectedIn: '29',
      id: '13188',
      averageValue: '10.95',
    },
    {
      auctionsSelectedIn: '32',
      id: '13113',
      averageValue: '10.93',
    },
    {
      auctionsSelectedIn: '70',
      id: '5848',
      averageValue: '10.91',
    },
    {
      auctionsSelectedIn: '72',
      id: '4925',
      averageValue: '10.78',
    },
    {
      auctionsSelectedIn: '72',
      id: '9884',
      averageValue: '10.74',
    },
    {
      auctionsSelectedIn: '2',
      id: '12661',
      averageValue: '10.71',
    },
    {
      auctionsSelectedIn: '63',
      id: '10527',
      averageValue: '10.38',
    },
    {
      auctionsSelectedIn: '31',
      id: '13192',
      averageValue: '10.20',
    },
    {
      auctionsSelectedIn: '45',
      id: '12676',
      averageValue: '9.50',
    },
    {
      auctionsSelectedIn: '65',
      id: '10302',
      averageValue: '9.23',
    },
    {
      auctionsSelectedIn: '55',
      id: '11673',
      averageValue: '9.14',
    },
    {
      auctionsSelectedIn: '41',
      id: '12658',
      averageValue: '8.85',
    },
    {
      auctionsSelectedIn: '16',
      id: '11721',
      averageValue: '8.80',
    },
    {
      auctionsSelectedIn: '64',
      id: '9431',
      averageValue: '8.69',
    },
    {
      auctionsSelectedIn: '31',
      id: '13189',
      averageValue: '8.69',
    },
    {
      auctionsSelectedIn: '46',
      id: '12152',
      averageValue: '8.57',
    },
    {
      auctionsSelectedIn: '69',
      id: '10276',
      averageValue: '8.54',
    },
    {
      auctionsSelectedIn: '55',
      id: '11677',
      averageValue: '8.41',
    },
    {
      auctionsSelectedIn: '44',
      id: '12627',
      averageValue: '8.17',
    },
    {
      auctionsSelectedIn: '83',
      id: '12801',
      averageValue: '8.09',
    },
    {
      auctionsSelectedIn: '63',
      id: '11199',
      averageValue: '8.00',
    },
    {
      auctionsSelectedIn: '30',
      id: '13133',
      averageValue: '7.72',
    },
    {
      auctionsSelectedIn: '1',
      id: '12396',
      averageValue: '7.62',
    },
    {
      auctionsSelectedIn: '48',
      id: '11936',
      averageValue: '7.57',
    },
    {
      auctionsSelectedIn: '57',
      id: '11250',
      averageValue: '7.47',
    },
    {
      auctionsSelectedIn: '31',
      id: '13116',
      averageValue: '7.42',
    },
    {
      auctionsSelectedIn: '28',
      id: '10272',
      averageValue: '7.32',
    },
    {
      auctionsSelectedIn: '10',
      id: '13222',
      averageValue: '7.27',
    },
    {
      auctionsSelectedIn: '74',
      id: '11454',
      averageValue: '7.13',
    },
    {
      auctionsSelectedIn: '73',
      id: '9662',
      averageValue: '7.00',
    },
    {
      auctionsSelectedIn: '1',
      id: '13282',
      averageValue: '7.00',
    },
    {
      auctionsSelectedIn: '25',
      id: '11960',
      averageValue: '6.91',
    },
    {
      auctionsSelectedIn: '15',
      id: '12686',
      averageValue: '6.86',
    },
    {
      auctionsSelectedIn: '62',
      id: '12184',
      averageValue: '6.83',
    },
    {
      auctionsSelectedIn: '58',
      id: '11676',
      averageValue: '6.77',
    },
    {
      auctionsSelectedIn: '22',
      id: '12425',
      averageValue: '6.77',
    },
    {
      auctionsSelectedIn: '10',
      id: '13216',
      averageValue: '6.63',
    },
    {
      auctionsSelectedIn: '2',
      id: '4397',
      averageValue: '6.57',
    },
    {
      auctionsSelectedIn: '70',
      id: '9918',
      averageValue: '6.46',
    },
    {
      auctionsSelectedIn: '65',
      id: '8687',
      averageValue: '6.36',
    },
    {
      auctionsSelectedIn: '83',
      id: '10500',
      averageValue: '6.32',
    },
    {
      auctionsSelectedIn: '31',
      id: '13138',
      averageValue: '6.31',
    },
    {
      auctionsSelectedIn: '31',
      id: '10862',
      averageValue: '6.23',
    },
    {
      auctionsSelectedIn: '81',
      id: '9427',
      averageValue: '6.13',
    },
    {
      auctionsSelectedIn: '32',
      id: '13132',
      averageValue: '6.09',
    },
    {
      auctionsSelectedIn: '24',
      id: '11757',
      averageValue: '6.08',
    },
    {
      auctionsSelectedIn: '49',
      id: '12176',
      averageValue: '6.06',
    },
    {
      auctionsSelectedIn: '80',
      id: '10308',
      averageValue: '6.02',
    },
    {
      auctionsSelectedIn: '67',
      id: '6789',
      averageValue: '5.99',
    },
    {
      auctionsSelectedIn: '24',
      id: '9966',
      averageValue: '5.97',
    },
    {
      auctionsSelectedIn: '31',
      id: '13155',
      averageValue: '5.92',
    },
    {
      auctionsSelectedIn: '27',
      id: '10487',
      averageValue: '5.75',
    },
    {
      auctionsSelectedIn: '16',
      id: '12250',
      averageValue: '5.69',
    },
    {
      auctionsSelectedIn: '65',
      id: '12261',
      averageValue: '5.58',
    },
    {
      auctionsSelectedIn: '29',
      id: '13156',
      averageValue: '5.55',
    },
    {
      auctionsSelectedIn: '4',
      id: '13243',
      averageValue: '5.53',
    },
    {
      auctionsSelectedIn: '65',
      id: '11390',
      averageValue: '5.50',
    },
    {
      auctionsSelectedIn: '69',
      id: '11668',
      averageValue: '5.47',
    },
    {
      auctionsSelectedIn: '49',
      id: '12155',
      averageValue: '5.46',
    },
    {
      auctionsSelectedIn: '84',
      id: '7394',
      averageValue: '5.43',
    },
    {
      auctionsSelectedIn: '85',
      id: '11201',
      averageValue: '5.17',
    },
    {
      auctionsSelectedIn: '59',
      id: '11688',
      averageValue: '5.16',
    },
    {
      auctionsSelectedIn: '35',
      id: '13115',
      averageValue: '5.14',
    },
    {
      auctionsSelectedIn: '44',
      id: '12632',
      averageValue: '5.12',
    },
    {
      auctionsSelectedIn: '104',
      id: '10709',
      averageValue: '5.11',
    },
    {
      auctionsSelectedIn: '66',
      id: '9831',
      averageValue: '5.02',
    },
    {
      auctionsSelectedIn: '1',
      id: '0616',
      averageValue: '5.00',
    },
    {
      auctionsSelectedIn: '72',
      id: '7401',
      averageValue: '4.96',
    },
    {
      auctionsSelectedIn: '58',
      id: '11695',
      averageValue: '4.95',
    },
    {
      auctionsSelectedIn: '25',
      id: '10773',
      averageValue: '4.93',
    },
    {
      auctionsSelectedIn: '168',
      id: '8670',
      averageValue: '4.91',
    },
    {
      auctionsSelectedIn: '50',
      id: '11247',
      averageValue: '4.88',
    },
    {
      auctionsSelectedIn: '22',
      id: '11293',
      averageValue: '4.87',
    },
    {
      auctionsSelectedIn: '8',
      id: '13265',
      averageValue: '4.86',
    },
    {
      auctionsSelectedIn: '76',
      id: '11193',
      averageValue: '4.86',
    },
    {
      auctionsSelectedIn: '30',
      id: '13134',
      averageValue: '4.80',
    },
    {
      auctionsSelectedIn: '33',
      id: '13176',
      averageValue: '4.78',
    },
    {
      auctionsSelectedIn: '60',
      id: '11760',
      averageValue: '4.72',
    },
    {
      auctionsSelectedIn: '18',
      id: '12233',
      averageValue: '4.72',
    },
    {
      auctionsSelectedIn: '64',
      id: '9925',
      averageValue: '4.72',
    },
    {
      auctionsSelectedIn: '43',
      id: '12631',
      averageValue: '4.71',
    },
    {
      auctionsSelectedIn: '2',
      id: '12371',
      averageValue: '4.67',
    },
    {
      auctionsSelectedIn: '24',
      id: '10768',
      averageValue: '4.65',
    },
    {
      auctionsSelectedIn: '71',
      id: '11951',
      averageValue: '4.61',
    },
    {
      auctionsSelectedIn: '48',
      id: '12177',
      averageValue: '4.59',
    },
    {
      auctionsSelectedIn: '31',
      id: '13157',
      averageValue: '4.53',
    },
    {
      auctionsSelectedIn: '67',
      id: '10313',
      averageValue: '4.52',
    },
    {
      auctionsSelectedIn: '28',
      id: '13234',
      averageValue: '4.48',
    },
    {
      auctionsSelectedIn: '44',
      id: '12648',
      averageValue: '4.39',
    },
    {
      auctionsSelectedIn: '35',
      id: '12805',
      averageValue: '4.32',
    },
    {
      auctionsSelectedIn: '13',
      id: '12779',
      averageValue: '4.30',
    },
    {
      auctionsSelectedIn: '110',
      id: '8360',
      averageValue: '4.21',
    },
    {
      auctionsSelectedIn: '75',
      id: '10413',
      averageValue: '4.19',
    },
    {
      auctionsSelectedIn: '73',
      id: '9044',
      averageValue: '4.14',
    },
    {
      auctionsSelectedIn: '11',
      id: '13261',
      averageValue: '4.13',
    },
    {
      auctionsSelectedIn: '1',
      id: '0613',
      averageValue: '4.12',
    },
    {
      auctionsSelectedIn: '59',
      id: '11642',
      averageValue: '4.08',
    },
    {
      auctionsSelectedIn: '36',
      id: '13114',
      averageValue: '4.07',
    },
    {
      auctionsSelectedIn: '5',
      id: '13198',
      averageValue: '4.05',
    },
    {
      auctionsSelectedIn: '107',
      id: '8658',
      averageValue: '4.02',
    },
    {
      auctionsSelectedIn: '1',
      id: '0604',
      averageValue: '4.00',
    },
    {
      auctionsSelectedIn: '27',
      id: '13237',
      averageValue: '4.00',
    },
    {
      auctionsSelectedIn: '22',
      id: '10775',
      averageValue: '3.91',
    },
    {
      auctionsSelectedIn: '76',
      id: '10697',
      averageValue: '3.86',
    },
    {
      auctionsSelectedIn: '24',
      id: '11728',
      averageValue: '3.86',
    },
    {
      auctionsSelectedIn: '102',
      id: '7393',
      averageValue: '3.82',
    },
    {
      auctionsSelectedIn: '20',
      id: '10815',
      averageValue: '3.79',
    },
    {
      auctionsSelectedIn: '22',
      id: '10267',
      averageValue: '3.79',
    },
    {
      auctionsSelectedIn: '29',
      id: '13139',
      averageValue: '3.73',
    },
    {
      auctionsSelectedIn: '81',
      id: '7391',
      averageValue: '3.65',
    },
    {
      auctionsSelectedIn: '84',
      id: '9436',
      averageValue: '3.64',
    },
    {
      auctionsSelectedIn: '26',
      id: '10782',
      averageValue: '3.58',
    },
    {
      auctionsSelectedIn: '19',
      id: '12230',
      averageValue: '3.57',
    },
    {
      auctionsSelectedIn: '25',
      id: '9825',
      averageValue: '3.52',
    },
    {
      auctionsSelectedIn: '29',
      id: '13163',
      averageValue: '3.51',
    },
    {
      auctionsSelectedIn: '33',
      id: '13236',
      averageValue: '3.49',
    },
    {
      auctionsSelectedIn: '42',
      id: '12611',
      averageValue: '3.46',
    },
    {
      auctionsSelectedIn: '39',
      id: '3494',
      averageValue: '3.38',
    },
    {
      auctionsSelectedIn: '64',
      id: '10312',
      averageValue: '3.31',
    },
    {
      auctionsSelectedIn: '17',
      id: '11722',
      averageValue: '3.31',
    },
    {
      auctionsSelectedIn: '28',
      id: '9828',
      averageValue: '3.31',
    },
    {
      auctionsSelectedIn: '18',
      id: '11349',
      averageValue: '3.31',
    },
    {
      auctionsSelectedIn: '49',
      id: '12677',
      averageValue: '3.30',
    },
    {
      auctionsSelectedIn: '27',
      id: '13167',
      averageValue: '3.30',
    },
    {
      auctionsSelectedIn: '15',
      id: '12711',
      averageValue: '3.29',
    },
    {
      auctionsSelectedIn: '17',
      id: '12745',
      averageValue: '3.25',
    },
    {
      auctionsSelectedIn: '1',
      id: '8653',
      averageValue: '3.25',
    },
    {
      auctionsSelectedIn: '97',
      id: '12465',
      averageValue: '3.24',
    },
    {
      auctionsSelectedIn: '30',
      id: '13135',
      averageValue: '3.24',
    },
    {
      auctionsSelectedIn: '20',
      id: '11813',
      averageValue: '3.23',
    },
    {
      auctionsSelectedIn: '31',
      id: '13146',
      averageValue: '3.22',
    },
    {
      auctionsSelectedIn: '17',
      id: '11347',
      averageValue: '3.20',
    },
    {
      auctionsSelectedIn: '84',
      id: '9075',
      averageValue: '3.20',
    },
    {
      auctionsSelectedIn: '29',
      id: '10783',
      averageValue: '3.19',
    },
    {
      auctionsSelectedIn: '43',
      id: '12647',
      averageValue: '3.19',
    },
    {
      auctionsSelectedIn: '84',
      id: '12391',
      averageValue: '3.17',
    },
    {
      auctionsSelectedIn: '45',
      id: '12197',
      averageValue: '3.16',
    },
    {
      auctionsSelectedIn: '14',
      id: '12736',
      averageValue: '3.14',
    },
    {
      auctionsSelectedIn: '23',
      id: '11706',
      averageValue: '3.12',
    },
    {
      auctionsSelectedIn: '85',
      id: '9881',
      averageValue: '3.10',
    },
    {
      auctionsSelectedIn: '11',
      id: '13200',
      averageValue: '3.09',
    },
    {
      auctionsSelectedIn: '72',
      id: '8416',
      averageValue: '3.09',
    },
    {
      auctionsSelectedIn: '32',
      id: '13193',
      averageValue: '3.08',
    },
    {
      auctionsSelectedIn: '83',
      id: '11188',
      averageValue: '3.08',
    },
    {
      auctionsSelectedIn: '78',
      id: '9064',
      averageValue: '3.07',
    },
    {
      auctionsSelectedIn: '118',
      id: '9122',
      averageValue: '3.07',
    },
    {
      auctionsSelectedIn: '90',
      id: '12887',
      averageValue: '3.05',
    },
    {
      auctionsSelectedIn: '4',
      id: '12925',
      averageValue: '3.02',
    },
    {
      auctionsSelectedIn: '18',
      id: '12221',
      averageValue: '2.99',
    },
    {
      auctionsSelectedIn: '75',
      id: '10369',
      averageValue: '2.98',
    },
    {
      auctionsSelectedIn: '29',
      id: '13143',
      averageValue: '2.96',
    },
    {
      auctionsSelectedIn: '27',
      id: '13164',
      averageValue: '2.91',
    },
    {
      auctionsSelectedIn: '67',
      id: '11783',
      averageValue: '2.91',
    },
    {
      auctionsSelectedIn: '32',
      id: '13254',
      averageValue: '2.90',
    },
    {
      auctionsSelectedIn: '25',
      id: '10753',
      averageValue: '2.89',
    },
    {
      auctionsSelectedIn: '30',
      id: '9051',
      averageValue: '2.88',
    },
    {
      auctionsSelectedIn: '14',
      id: '13217',
      averageValue: '2.85',
    },
    {
      auctionsSelectedIn: '4',
      id: '12907',
      averageValue: '2.84',
    },
    {
      auctionsSelectedIn: '24',
      id: '9840',
      averageValue: '2.83',
    },
    {
      auctionsSelectedIn: '1',
      id: '0673',
      averageValue: '2.83',
    },
    {
      auctionsSelectedIn: '8',
      id: '13230',
      averageValue: '2.81',
    },
    {
      auctionsSelectedIn: '4',
      id: '13278',
      averageValue: '2.80',
    },
    {
      auctionsSelectedIn: '6',
      id: '11345',
      averageValue: '2.79',
    },
    {
      auctionsSelectedIn: '56',
      id: '12169',
      averageValue: '2.78',
    },
    {
      auctionsSelectedIn: '28',
      id: '9866',
      averageValue: '2.77',
    },
    {
      auctionsSelectedIn: '61',
      id: '11654',
      averageValue: '2.75',
    },
    {
      auctionsSelectedIn: '34',
      id: '13319',
      averageValue: '2.74',
    },
    {
      auctionsSelectedIn: '8',
      id: '13221',
      averageValue: '2.73',
    },
    {
      auctionsSelectedIn: '10',
      id: '13285',
      averageValue: '2.71',
    },
    {
      auctionsSelectedIn: '24',
      id: '11267',
      averageValue: '2.71',
    },
    {
      auctionsSelectedIn: '24',
      id: '9833',
      averageValue: '2.70',
    },
    {
      auctionsSelectedIn: '8',
      id: '10945',
      averageValue: '2.70',
    },
    {
      auctionsSelectedIn: '25',
      id: '9815',
      averageValue: '2.69',
    },
    {
      auctionsSelectedIn: '31',
      id: '10314',
      averageValue: '2.69',
    },
    {
      auctionsSelectedIn: '54',
      id: '12205',
      averageValue: '2.68',
    },
    {
      auctionsSelectedIn: '5',
      id: '13283',
      averageValue: '2.65',
    },
    {
      auctionsSelectedIn: '26',
      id: '9816',
      averageValue: '2.64',
    },
    {
      auctionsSelectedIn: '41',
      id: '10982',
      averageValue: '2.63',
    },
    {
      auctionsSelectedIn: '22',
      id: '10772',
      averageValue: '2.62',
    },
    {
      auctionsSelectedIn: '42',
      id: '12157',
      averageValue: '2.62',
    },
    {
      auctionsSelectedIn: '1',
      id: '13066',
      averageValue: '2.62',
    },
    {
      auctionsSelectedIn: '70',
      id: '10738',
      averageValue: '2.62',
    },
    {
      auctionsSelectedIn: '7',
      id: '13256',
      averageValue: '2.58',
    },
    {
      auctionsSelectedIn: '47',
      id: '12645',
      averageValue: '2.57',
    },
    {
      auctionsSelectedIn: '24',
      id: '11313',
      averageValue: '2.57',
    },
    {
      auctionsSelectedIn: '22',
      id: '11772',
      averageValue: '2.57',
    },
    {
      auctionsSelectedIn: '4',
      id: '12800',
      averageValue: '2.55',
    },
    {
      auctionsSelectedIn: '56',
      id: '8742',
      averageValue: '2.55',
    },
    {
      auctionsSelectedIn: '7',
      id: '13215',
      averageValue: '2.54',
    },
    {
      auctionsSelectedIn: '6',
      id: '5646',
      averageValue: '2.54',
    },
    {
      auctionsSelectedIn: '27',
      id: '10292',
      averageValue: '2.53',
    },
    {
      auctionsSelectedIn: '110',
      id: '11516',
      averageValue: '2.52',
    },
    {
      auctionsSelectedIn: '25',
      id: '13171',
      averageValue: '2.50',
    },
    {
      auctionsSelectedIn: '18',
      id: '12272',
      averageValue: '2.49',
    },
    {
      auctionsSelectedIn: '28',
      id: '13190',
      averageValue: '2.47',
    },
    {
      auctionsSelectedIn: '1',
      id: '0677',
      averageValue: '2.47',
    },
    {
      auctionsSelectedIn: '37',
      id: '10774',
      averageValue: '2.46',
    },
    {
      auctionsSelectedIn: '122',
      id: '11938',
      averageValue: '2.45',
    },
    {
      auctionsSelectedIn: '1',
      id: '0652',
      averageValue: '2.45',
    },
    {
      auctionsSelectedIn: '1',
      id: '0663',
      averageValue: '2.45',
    },
    {
      auctionsSelectedIn: '15',
      id: '12688',
      averageValue: '2.45',
    },
    {
      auctionsSelectedIn: '93',
      id: '9250',
      averageValue: '2.44',
    },
    {
      auctionsSelectedIn: '1',
      id: '0654',
      averageValue: '2.43',
    },
    {
      auctionsSelectedIn: '24',
      id: '11740',
      averageValue: '2.43',
    },
    {
      auctionsSelectedIn: '24',
      id: '10762',
      averageValue: '2.43',
    },
    {
      auctionsSelectedIn: '14',
      id: '13248',
      averageValue: '2.40',
    },
    {
      auctionsSelectedIn: '99',
      id: '7813',
      averageValue: '2.35',
    },
    {
      auctionsSelectedIn: '73',
      id: '10903',
      averageValue: '2.35',
    },
    {
      auctionsSelectedIn: '20',
      id: '12245',
      averageValue: '2.34',
    },
    {
      auctionsSelectedIn: '37',
      id: '8669',
      averageValue: '2.31',
    },
    {
      auctionsSelectedIn: '43',
      id: '10770',
      averageValue: '2.31',
    },
    {
      auctionsSelectedIn: '6',
      id: '13267',
      averageValue: '2.31',
    },
    {
      auctionsSelectedIn: '19',
      id: '12225',
      averageValue: '2.30',
    },
    {
      auctionsSelectedIn: '14',
      id: '12239',
      averageValue: '2.29',
    },
    {
      auctionsSelectedIn: '111',
      id: '9898',
      averageValue: '2.29',
    },
    {
      auctionsSelectedIn: '2',
      id: '0626',
      averageValue: '2.28',
    },
    {
      auctionsSelectedIn: '5',
      id: '11971',
      averageValue: '2.27',
    },
    {
      auctionsSelectedIn: '1',
      id: '0676',
      averageValue: '2.26',
    },
    {
      auctionsSelectedIn: '112',
      id: '11152',
      averageValue: '2.26',
    },
    {
      auctionsSelectedIn: '15',
      id: '11007',
      averageValue: '2.26',
    },
    {
      auctionsSelectedIn: '3',
      id: '13211',
      averageValue: '2.24',
    },
    {
      auctionsSelectedIn: '43',
      id: '12187',
      averageValue: '2.24',
    },
    {
      auctionsSelectedIn: '95',
      id: '9525',
      averageValue: '2.23',
    },
    {
      auctionsSelectedIn: '28',
      id: '11045',
      averageValue: '2.23',
    },
    {
      auctionsSelectedIn: '110',
      id: '9101',
      averageValue: '2.22',
    },
    {
      auctionsSelectedIn: '3',
      id: '0562',
      averageValue: '2.22',
    },
    {
      auctionsSelectedIn: '15',
      id: '12702',
      averageValue: '2.21',
    },
    {
      auctionsSelectedIn: '20',
      id: '13257',
      averageValue: '2.20',
    },
    {
      auctionsSelectedIn: '139',
      id: '11182',
      averageValue: '2.19',
    },
    {
      auctionsSelectedIn: '26',
      id: '11327',
      averageValue: '2.19',
    },
    {
      auctionsSelectedIn: '33',
      id: '10350',
      averageValue: '2.19',
    },
    {
      auctionsSelectedIn: '29',
      id: '10277',
      averageValue: '2.19',
    },
    {
      auctionsSelectedIn: '112',
      id: '6929',
      averageValue: '2.18',
    },
    {
      auctionsSelectedIn: '34',
      id: '9430',
      averageValue: '2.18',
    },
    {
      auctionsSelectedIn: '35',
      id: '12237',
      averageValue: '2.17',
    },
    {
      auctionsSelectedIn: '45',
      id: '7826',
      averageValue: '2.14',
    },
    {
      auctionsSelectedIn: '52',
      id: '12678',
      averageValue: '2.14',
    },
    {
      auctionsSelectedIn: '14',
      id: '13223',
      averageValue: '2.13',
    },
    {
      auctionsSelectedIn: '26',
      id: '0511',
      averageValue: '2.13',
    },
    {
      auctionsSelectedIn: '16',
      id: '12738',
      averageValue: '2.12',
    },
    {
      auctionsSelectedIn: '35',
      id: '9694',
      averageValue: '2.11',
    },
    {
      auctionsSelectedIn: '39',
      id: '12612',
      averageValue: '2.09',
    },
    {
      auctionsSelectedIn: '6',
      id: '13231',
      averageValue: '2.09',
    },
    {
      auctionsSelectedIn: '10',
      id: '13205',
      averageValue: '2.08',
    },
    {
      auctionsSelectedIn: '88',
      id: '10372',
      averageValue: '2.07',
    },
    {
      auctionsSelectedIn: '109',
      id: '11180',
      averageValue: '2.07',
    },
    {
      auctionsSelectedIn: '90',
      id: '11746',
      averageValue: '2.06',
    },
    {
      auctionsSelectedIn: '16',
      id: '13204',
      averageValue: '2.06',
    },
    {
      auctionsSelectedIn: '24',
      id: '11324',
      averageValue: '2.05',
    },
    {
      auctionsSelectedIn: '96',
      id: '9467',
      averageValue: '2.03',
    },
    {
      auctionsSelectedIn: '101',
      id: '10973',
      averageValue: '2.03',
    },
    {
      auctionsSelectedIn: '84',
      id: '10742',
      averageValue: '2.03',
    },
    {
      auctionsSelectedIn: '79',
      id: '12110',
      averageValue: '1.98',
    },
    {
      auctionsSelectedIn: '126',
      id: '7877',
      averageValue: '1.98',
    },
    {
      auctionsSelectedIn: '7',
      id: '13245',
      averageValue: '1.97',
    },
    {
      auctionsSelectedIn: '3',
      id: '0610',
      averageValue: '1.97',
    },
    {
      auctionsSelectedIn: '1',
      id: '0675',
      averageValue: '1.96',
    },
    {
      auctionsSelectedIn: '33',
      id: '8684',
      averageValue: '1.96',
    },
    {
      auctionsSelectedIn: '86',
      id: '9817',
      averageValue: '1.96',
    },
    {
      auctionsSelectedIn: '23',
      id: '11767',
      averageValue: '1.94',
    },
    {
      auctionsSelectedIn: '110',
      id: '9693',
      averageValue: '1.94',
    },
    {
      auctionsSelectedIn: '26',
      id: '12280',
      averageValue: '1.94',
    },
    {
      auctionsSelectedIn: '21',
      id: '12287',
      averageValue: '1.94',
    },
    {
      auctionsSelectedIn: '26',
      id: '9864',
      averageValue: '1.94',
    },
    {
      auctionsSelectedIn: '2',
      id: '12914',
      averageValue: '1.94',
    },
    {
      auctionsSelectedIn: '33',
      id: '13125',
      averageValue: '1.93',
    },
    {
      auctionsSelectedIn: '34',
      id: '13127',
      averageValue: '1.93',
    },
    {
      auctionsSelectedIn: '74',
      id: '10960',
      averageValue: '1.92',
    },
    {
      auctionsSelectedIn: '53',
      id: '12153',
      averageValue: '1.91',
    },
    {
      auctionsSelectedIn: '48',
      id: '8359',
      averageValue: '1.91',
    },
    {
      auctionsSelectedIn: '121',
      id: '9054',
      averageValue: '1.90',
    },
    {
      auctionsSelectedIn: '1',
      id: '0666',
      averageValue: '1.89',
    },
    {
      auctionsSelectedIn: '1',
      id: '0679',
      averageValue: '1.87',
    },
    {
      auctionsSelectedIn: '41',
      id: '12669',
      averageValue: '1.87',
    },
    {
      auctionsSelectedIn: '45',
      id: '9749',
      averageValue: '1.86',
    },
    {
      auctionsSelectedIn: '18',
      id: '12087',
      averageValue: '1.86',
    },
    {
      auctionsSelectedIn: '12',
      id: '13212',
      averageValue: '1.86',
    },
    {
      auctionsSelectedIn: '1',
      id: '11796',
      averageValue: '1.85',
    },
    {
      auctionsSelectedIn: '10',
      id: '13199',
      averageValue: '1.84',
    },
    {
      auctionsSelectedIn: '21',
      id: '11308',
      averageValue: '1.84',
    },
    {
      auctionsSelectedIn: '4',
      id: '0629',
      averageValue: '1.83',
    },
    {
      auctionsSelectedIn: '25',
      id: '12417',
      averageValue: '1.83',
    },
    {
      auctionsSelectedIn: '43',
      id: '12629',
      averageValue: '1.82',
    },
    {
      auctionsSelectedIn: '62',
      id: '7260',
      averageValue: '1.81',
    },
    {
      auctionsSelectedIn: '20',
      id: '0532',
      averageValue: '1.80',
    },
    {
      auctionsSelectedIn: '12',
      id: '13226',
      averageValue: '1.79',
    },
    {
      auctionsSelectedIn: '90',
      id: '11850',
      averageValue: '1.78',
    },
    {
      auctionsSelectedIn: '75',
      id: '10743',
      averageValue: '1.78',
    },
    {
      auctionsSelectedIn: '38',
      id: '13119',
      averageValue: '1.74',
    },
    {
      auctionsSelectedIn: '23',
      id: '10266',
      averageValue: '1.74',
    },
    {
      auctionsSelectedIn: '35',
      id: '10026',
      averageValue: '1.73',
    },
    {
      auctionsSelectedIn: '80',
      id: '11747',
      averageValue: '1.72',
    },
    {
      auctionsSelectedIn: '12',
      id: '11877',
      averageValue: '1.71',
    },
    {
      auctionsSelectedIn: '3',
      id: '11256',
      averageValue: '1.71',
    },
    {
      auctionsSelectedIn: '45',
      id: '9425',
      averageValue: '1.71',
    },
    {
      auctionsSelectedIn: '33',
      id: '13280',
      averageValue: '1.71',
    },
    {
      auctionsSelectedIn: '4',
      id: '0623',
      averageValue: '1.70',
    },
    {
      auctionsSelectedIn: '31',
      id: '10269',
      averageValue: '1.70',
    },
    {
      auctionsSelectedIn: '2',
      id: '13027',
      averageValue: '1.69',
    },
    {
      auctionsSelectedIn: '31',
      id: '12278',
      averageValue: '1.69',
    },
    {
      auctionsSelectedIn: '1',
      id: '0672',
      averageValue: '1.68',
    },
    {
      auctionsSelectedIn: '67',
      id: '11672',
      averageValue: '1.68',
    },
    {
      auctionsSelectedIn: '3',
      id: '0620',
      averageValue: '1.68',
    },
    {
      auctionsSelectedIn: '11',
      id: '12717',
      averageValue: '1.68',
    },
    {
      auctionsSelectedIn: '30',
      id: '11333',
      averageValue: '1.68',
    },
    {
      auctionsSelectedIn: '31',
      id: '10851',
      averageValue: '1.67',
    },
    {
      auctionsSelectedIn: '41',
      id: '9877',
      averageValue: '1.67',
    },
    {
      auctionsSelectedIn: '33',
      id: '13173',
      averageValue: '1.67',
    },
    {
      auctionsSelectedIn: '10',
      id: '13284',
      averageValue: '1.66',
    },
    {
      auctionsSelectedIn: '30',
      id: '9829',
      averageValue: '1.66',
    },
    {
      auctionsSelectedIn: '25',
      id: '10749',
      averageValue: '1.65',
    },
    {
      auctionsSelectedIn: '23',
      id: '11775',
      averageValue: '1.65',
    },
    {
      auctionsSelectedIn: '12',
      id: '12687',
      averageValue: '1.65',
    },
    {
      auctionsSelectedIn: '7',
      id: '10719',
      averageValue: '1.65',
    },
    {
      auctionsSelectedIn: '68',
      id: '8951',
      averageValue: '1.64',
    },
    {
      auctionsSelectedIn: '30',
      id: '13191',
      averageValue: '1.64',
    },
    {
      auctionsSelectedIn: '27',
      id: '10816',
      averageValue: '1.63',
    },
    {
      auctionsSelectedIn: '85',
      id: '10389',
      averageValue: '1.63',
    },
    {
      auctionsSelectedIn: '2',
      id: '13308',
      averageValue: '1.62',
    },
    {
      auctionsSelectedIn: '30',
      id: '10976',
      averageValue: '1.62',
    },
    {
      auctionsSelectedIn: '18',
      id: '11323',
      averageValue: '1.61',
    },
    {
      auctionsSelectedIn: '84',
      id: '12912',
      averageValue: '1.60',
    },
    {
      auctionsSelectedIn: '28',
      id: '11283',
      averageValue: '1.60',
    },
    {
      auctionsSelectedIn: '73',
      id: '11925',
      averageValue: '1.60',
    },
    {
      auctionsSelectedIn: '25',
      id: '10779',
      averageValue: '1.59',
    },
    {
      auctionsSelectedIn: '29',
      id: '10847',
      averageValue: '1.59',
    },
    {
      auctionsSelectedIn: '36',
      id: '9868',
      averageValue: '1.57',
    },
    {
      auctionsSelectedIn: '36',
      id: '9947',
      averageValue: '1.57',
    },
    {
      auctionsSelectedIn: '10',
      id: '12788',
      averageValue: '1.57',
    },
    {
      auctionsSelectedIn: '4',
      id: '1238',
      averageValue: '1.56',
    },
    {
      auctionsSelectedIn: '3',
      id: '1395',
      averageValue: '1.56',
    },
    {
      auctionsSelectedIn: '76',
      id: '11227',
      averageValue: '1.56',
    },
    {
      auctionsSelectedIn: '26',
      id: '10846',
      averageValue: '1.56',
    },
    {
      auctionsSelectedIn: '3',
      id: '8235',
      averageValue: '1.56',
    },
    {
      auctionsSelectedIn: '35',
      id: '10074',
      averageValue: '1.56',
    },
    {
      auctionsSelectedIn: '36',
      id: '12222',
      averageValue: '1.55',
    },
    {
      auctionsSelectedIn: '15',
      id: '12217',
      averageValue: '1.54',
    },
    {
      auctionsSelectedIn: '3',
      id: '12664',
      averageValue: '1.54',
    },
    {
      auctionsSelectedIn: '66',
      id: '11656',
      averageValue: '1.53',
    },
    {
      auctionsSelectedIn: '3',
      id: '0778',
      averageValue: '1.53',
    },
    {
      auctionsSelectedIn: '1',
      id: '0668',
      averageValue: '1.52',
    },
    {
      auctionsSelectedIn: '31',
      id: '13168',
      averageValue: '1.50',
    },
    {
      auctionsSelectedIn: '37',
      id: '9041',
      averageValue: '1.50',
    },
    {
      auctionsSelectedIn: '13',
      id: '12735',
      averageValue: '1.50',
    },
    {
      auctionsSelectedIn: '101',
      id: '11698',
      averageValue: '1.49',
    },
    {
      auctionsSelectedIn: '45',
      id: '9319',
      averageValue: '1.49',
    },
    {
      auctionsSelectedIn: '50',
      id: '10808',
      averageValue: '1.49',
    },
    {
      auctionsSelectedIn: '56',
      id: '11403',
      averageValue: '1.49',
    },
    {
      auctionsSelectedIn: '7',
      id: '12656',
      averageValue: '1.47',
    },
    {
      auctionsSelectedIn: '18',
      id: '8697',
      averageValue: '1.47',
    },
    {
      auctionsSelectedIn: '37',
      id: '10750',
      averageValue: '1.47',
    },
    {
      auctionsSelectedIn: '16',
      id: '0512',
      averageValue: '1.46',
    },
    {
      auctionsSelectedIn: '15',
      id: '13251',
      averageValue: '1.46',
    },
    {
      auctionsSelectedIn: '88',
      id: '11228',
      averageValue: '1.46',
    },
    {
      auctionsSelectedIn: '10',
      id: '13241',
      averageValue: '1.46',
    },
    {
      auctionsSelectedIn: '108',
      id: '11975',
      averageValue: '1.45',
    },
    {
      auctionsSelectedIn: '111',
      id: '6997',
      averageValue: '1.44',
    },
    {
      auctionsSelectedIn: '14',
      id: '12219',
      averageValue: '1.44',
    },
    {
      auctionsSelectedIn: '9',
      id: '10220',
      averageValue: '1.44',
    },
    {
      auctionsSelectedIn: '27',
      id: '10265',
      averageValue: '1.43',
    },
    {
      auctionsSelectedIn: '1',
      id: '12100',
      averageValue: '1.43',
    },
    {
      auctionsSelectedIn: '8',
      id: '13213',
      averageValue: '1.42',
    },
    {
      auctionsSelectedIn: '53',
      id: '11640',
      averageValue: '1.42',
    },
    {
      auctionsSelectedIn: '5',
      id: '13320',
      averageValue: '1.42',
    },
    {
      auctionsSelectedIn: '27',
      id: '9826',
      averageValue: '1.40',
    },
    {
      auctionsSelectedIn: '53',
      id: '11375',
      averageValue: '1.39',
    },
    {
      auctionsSelectedIn: '79',
      id: '11213',
      averageValue: '1.39',
    },
    {
      auctionsSelectedIn: '13',
      id: '12703',
      averageValue: '1.39',
    },
    {
      auctionsSelectedIn: '9',
      id: '8712',
      averageValue: '1.39',
    },
    {
      auctionsSelectedIn: '42',
      id: '7827',
      averageValue: '1.38',
    },
    {
      auctionsSelectedIn: '9',
      id: '13206',
      averageValue: '1.38',
    },
    {
      auctionsSelectedIn: '14',
      id: '13202',
      averageValue: '1.38',
    },
    {
      auctionsSelectedIn: '88',
      id: '10723',
      averageValue: '1.37',
    },
    {
      auctionsSelectedIn: '26',
      id: '12268',
      averageValue: '1.37',
    },
    {
      auctionsSelectedIn: '31',
      id: '13195',
      averageValue: '1.37',
    },
    {
      auctionsSelectedIn: '27',
      id: '9904',
      averageValue: '1.37',
    },
    {
      auctionsSelectedIn: '101',
      id: '8673',
      averageValue: '1.36',
    },
    {
      auctionsSelectedIn: '23',
      id: '10850',
      averageValue: '1.36',
    },
    {
      auctionsSelectedIn: '12',
      id: '13220',
      averageValue: '1.36',
    },
    {
      auctionsSelectedIn: '25',
      id: '10335',
      averageValue: '1.35',
    },
    {
      auctionsSelectedIn: '18',
      id: '12778',
      averageValue: '1.35',
    },
    {
      auctionsSelectedIn: '40',
      id: '11382',
      averageValue: '1.35',
    },
    {
      auctionsSelectedIn: '17',
      id: '12295',
      averageValue: '1.34',
    },
    {
      auctionsSelectedIn: '34',
      id: '11316',
      averageValue: '1.34',
    },
    {
      auctionsSelectedIn: '38',
      id: '11387',
      averageValue: '1.33',
    },
    {
      auctionsSelectedIn: '14',
      id: '12243',
      averageValue: '1.33',
    },
    {
      auctionsSelectedIn: '24',
      id: '8153',
      averageValue: '1.33',
    },
    {
      auctionsSelectedIn: '27',
      id: '11788',
      averageValue: '1.33',
    },
    {
      auctionsSelectedIn: '73',
      id: '10744',
      averageValue: '1.33',
    },
    {
      auctionsSelectedIn: '13',
      id: '12712',
      averageValue: '1.33',
    },
    {
      auctionsSelectedIn: '91',
      id: '9474',
      averageValue: '1.32',
    },
    {
      auctionsSelectedIn: '22',
      id: '10465',
      averageValue: '1.32',
    },
    {
      auctionsSelectedIn: '11',
      id: '13214',
      averageValue: '1.32',
    },
    {
      auctionsSelectedIn: '110',
      id: '9933',
      averageValue: '1.31',
    },
    {
      auctionsSelectedIn: '51',
      id: '11761',
      averageValue: '1.30',
    },
    {
      auctionsSelectedIn: '115',
      id: '9714',
      averageValue: '1.29',
    },
    {
      auctionsSelectedIn: '19',
      id: '0515',
      averageValue: '1.29',
    },
    {
      auctionsSelectedIn: '1',
      id: '0660',
      averageValue: '1.29',
    },
    {
      auctionsSelectedIn: '37',
      id: '11457',
      averageValue: '1.29',
    },
    {
      auctionsSelectedIn: '85',
      id: '11681',
      averageValue: '1.29',
    },
    {
      auctionsSelectedIn: '54',
      id: '8448',
      averageValue: '1.28',
    },
    {
      auctionsSelectedIn: '6',
      id: '10368',
      averageValue: '1.28',
    },
    {
      auctionsSelectedIn: '32',
      id: '10789',
      averageValue: '1.28',
    },
    {
      auctionsSelectedIn: '31',
      id: '12743',
      averageValue: '1.28',
    },
    {
      auctionsSelectedIn: '22',
      id: '12274',
      averageValue: '1.28',
    },
    {
      auctionsSelectedIn: '13',
      id: '12701',
      averageValue: '1.27',
    },
    {
      auctionsSelectedIn: '11',
      id: '13228',
      averageValue: '1.27',
    },
    {
      auctionsSelectedIn: '103',
      id: '11904',
      averageValue: '1.27',
    },
    {
      auctionsSelectedIn: '10',
      id: '12640',
      averageValue: '1.27',
    },
    {
      auctionsSelectedIn: '40',
      id: '8713',
      averageValue: '1.26',
    },
    {
      auctionsSelectedIn: '3',
      id: '0608',
      averageValue: '1.26',
    },
    {
      auctionsSelectedIn: '24',
      id: '11720',
      averageValue: '1.26',
    },
    {
      auctionsSelectedIn: '86',
      id: '9851',
      averageValue: '1.25',
    },
    {
      auctionsSelectedIn: '10',
      id: '11977',
      averageValue: '1.24',
    },
    {
      auctionsSelectedIn: '25',
      id: '11310',
      averageValue: '1.24',
    },
    {
      auctionsSelectedIn: '44',
      id: '7423',
      averageValue: '1.23',
    },
    {
      auctionsSelectedIn: '88',
      id: '10289',
      averageValue: '1.22',
    },
    {
      auctionsSelectedIn: '43',
      id: '12650',
      averageValue: '1.21',
    },
    {
      auctionsSelectedIn: '23',
      id: '8668',
      averageValue: '1.21',
    },
    {
      auctionsSelectedIn: '93',
      id: '6589',
      averageValue: '1.21',
    },
    {
      auctionsSelectedIn: '28',
      id: '10260',
      averageValue: '1.20',
    },
    {
      auctionsSelectedIn: '30',
      id: '11965',
      averageValue: '1.20',
    },
    {
      auctionsSelectedIn: '19',
      id: '12234',
      averageValue: '1.20',
    },
    {
      auctionsSelectedIn: '42',
      id: '11350',
      averageValue: '1.20',
    },
    {
      auctionsSelectedIn: '36',
      id: '11456',
      averageValue: '1.19',
    },
    {
      auctionsSelectedIn: '41',
      id: '13141',
      averageValue: '1.19',
    },
    {
      auctionsSelectedIn: '46',
      id: '10823',
      averageValue: '1.19',
    },
    {
      auctionsSelectedIn: '19',
      id: '0504',
      averageValue: '1.19',
    },
    {
      auctionsSelectedIn: '32',
      id: '13121',
      averageValue: '1.19',
    },
    {
      auctionsSelectedIn: '73',
      id: '10409',
      averageValue: '1.19',
    },
    {
      auctionsSelectedIn: '42',
      id: '11754',
      averageValue: '1.19',
    },
    {
      auctionsSelectedIn: '55',
      id: '11512',
      averageValue: '1.19',
    },
    {
      auctionsSelectedIn: '17',
      id: '12718',
      averageValue: '1.19',
    },
    {
      auctionsSelectedIn: '43',
      id: '12636',
      averageValue: '1.18',
    },
    {
      auctionsSelectedIn: '43',
      id: '10339',
      averageValue: '1.18',
    },
    {
      auctionsSelectedIn: '5',
      id: '12255',
      averageValue: '1.18',
    },
    {
      auctionsSelectedIn: '17',
      id: '13293',
      averageValue: '1.17',
    },
    {
      auctionsSelectedIn: '38',
      id: '12630',
      averageValue: '1.15',
    },
    {
      auctionsSelectedIn: '37',
      id: '13120',
      averageValue: '1.15',
    },
    {
      auctionsSelectedIn: '26',
      id: '0519',
      averageValue: '1.15',
    },
  ];

  const aav = aav_raw.map(x => parseFloat(x.averageValue));

  rp(options)
    .then(
      Meteor.bindEnvironment(function ($) {
        // Process html like you would with jQuery...
        const raw = $('[class^="mpb-player"]');

        const players = raw
          .map((i, x) => {
            if (x.children[2].children[0].children[0]) {
              const name = cleanName(x.children[2].children[0].children[0].data);
              const best = parseInt(x.children[8].children[0].data);
              const worst = parseInt(x.children[10].children[0].data);
              const rank = parseFloat(x.children[12].children[0].data);
              const stdev = parseFloat(x.children[14].children[0].data);
              const pos = x.children[4].children[0].data;
              const isQb = x.children[4].children[0].data.indexOf('QB') > -1;
              const superScore = isQb ? rank - 35 : rank;
              return {
                name,
                best,
                worst,
                rank,
                stdev,
                pos,
                superScore,
              };
            }
          })
          .toArray();
        const playersSuper = players.slice().sort((a, b) => a.superScore - b.superScore);
        let playersFinal = playersSuper.map((x, i) => {
          const obj = x;
          obj.super = i + 1;
          const diff = obj.super - obj.rank;
          obj.stdev_2qb = obj.stdev;
          obj.best_2qb = obj.best + diff > 1 ? obj.best + diff : 1;
          obj.worst_2qb = obj.worst + diff > 1 ? obj.worst + diff : 1;
          return obj;
        });
        Meteor.call('players.getAllPlayers', (err, result) => {
          playersFinal.forEach(player => {
            const dbPlayer = result.find(x => x.name.toLowerCase() === player.name.toLowerCase());
            if (dbPlayer) player.player = dbPlayer;
            if (dbPlayer && dbPlayer.status === 'R') player.isRookie = true;
          });

          // Sort players by rank and assign value
          playersFinal.sort((a, b) => a.rank - b.rank);
          let val = 10000;
          let last = null;
          for (let y = 0; y < playersFinal.length; y++) {
            if (last && playersFinal[y].rank !== last.rank) {
              if (val > 2000) {
                val = parseInt(val * 0.971);
              } else {
                val = parseInt(val * 0.985);
              }
            }
            playersFinal[y].aav = parseFloat((aav[y] / 1000).toFixed(5));
            playersFinal[y].value = val;
            last = playersFinal[y];
          }

          // Sort players by 2qb rank and assign values
          playersFinal.sort((a, b) => a.super - b.super);
          val = 10000;
          last = null;
          for (let y = 0; y < playersFinal.length; y++) {
            if (last && playersFinal[y].super !== last.super) {
              if (val > 2000) {
                val = parseInt(val * 0.971);
              } else {
                val = parseInt(val * 0.987);
              }
            }
            playersFinal[y].aav_2qb = parseFloat((aav[y] / 1000).toFixed(5));
            playersFinal[y].value_2qb = val;
            last = playersFinal[y];
          }

          const rookies = playersFinal.filter(x => x.isRookie).sort((a, b) => a.rank - b.rank);
          const rookies_2qb = playersFinal
            .filter(x => x.isRookie)
            .sort((a, b) => a.super - b.super);

          const round1 = [];
          const round2 = [];
          const round3 = [];
          const round4 = [];

          for (var y = 0; y < 48; y++) {
            if (y < 12) round1.push([rookies[y], rookies_2qb[y]]);
            if (y > 11 && y < 24) round2.push([rookies[y], rookies_2qb[y]]);
            if (y > 23 && y < 36) round3.push([rookies[y], rookies_2qb[y]]);
            if (y > 35 && y < 48) round4.push([rookies[y], rookies_2qb[y]]);
          }

          const year1 = [];

          round1.forEach((x, index) =>
            year1.push({
              name: `2017 Pick ${index + 1}`,
              round: 1,
              rank: {
                time: new Date(),
                adp: x[0].rank,
                adp_2qb: x[1].super,
                low: x[0].best,
                low_2qb: x[1].best_2qb,
                high: x[0].worst,
                high_2qb: x[1].worst_2qb,
                stdev: x[0].stdev,
                stdev_2qb: x[1].stdev_2qb,
                value: x[0].value,
                value_2qb: x[1].value_2qb,
              },
            })
          );

          round2.forEach((x, index) =>
            year1.push({
              name: `2017 Pick ${index + 1 + 12}`,
              round: 2,
              rank: {
                time: new Date(),
                adp: x[0].rank,
                adp_2qb: x[1].super,
                low: x[0].best,
                low_2qb: x[1].best_2qb,
                high: x[0].worst,
                high_2qb: x[1].worst_2qb,
                stdev: x[0].stdev,
                stdev_2qb: x[1].stdev_2qb,
                value: x[0].value,
                value_2qb: x[1].value_2qb,
              },
            })
          );

          round3.forEach((x, index) =>
            year1.push({
              name: `2017 Pick ${index + 1 + 24}`,
              round: 3,
              rank: {
                time: new Date(),
                adp: x[0].rank,
                adp_2qb: x[1].super,
                low: x[0].best,
                low_2qb: x[1].best_2qb,
                high: x[0].worst,
                high_2qb: x[1].worst_2qb,
                stdev: x[0].stdev,
                stdev_2qb: x[1].stdev_2qb,
                value: x[0].value,
                value_2qb: x[1].value_2qb,
              },
            })
          );

          round4.forEach((x, index) =>
            year1.push({
              name: `2017 Pick ${index + 1 + 36}`,
              round: 4,
              rank: {
                time: new Date(),
                adp: x[0].rank,
                adp_2qb: x[1].super,
                low: x[0].best,
                low_2qb: x[1].best_2qb,
                high: x[0].worst,
                high_2qb: x[1].worst_2qb,
                stdev: x[0].stdev,
                stdev_2qb: x[1].stdev_2qb,
                value: x[0].value,
                value_2qb: x[1].value_2qb,
              },
            })
          );

          const pickRanks = [...year1];

          pickRanks.push({
            name: '2017 1st',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 1) acc += val.rank.adp;
                  return acc;
                }, 0) / 12
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 1) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 12
              ),
              low: year1[0].rank.adp,
              low_2qb: year1[0].rank.adp_2qb,
              high: year1[11].rank.adp,
              high_2qb: year1[11].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val) => {
                  if (val.round === 1) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val) => {
                  if (val.round === 1) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 1) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 12
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 1) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 12
              ),
            },
          });

          pickRanks.push({
            name: '2017 Early 1st',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i < 4) acc += val.rank.adp;
                  return acc;
                }, 0) / 4
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i < 4) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 4
              ),
              low: year1[0].rank.adp,
              low_2qb: year1[0].rank.adp_2qb,
              high: year1[3].rank.adp,
              high_2qb: year1[3].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i < 4) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i < 4) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i < 4) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 4
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i < 4) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 4
              ),
            },
          });

          pickRanks.push({
            name: '2017 Mid 1st',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 3 && i < 8) acc += val.rank.adp;
                  return acc;
                }, 0) / 4
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 3 && i < 8) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 4
              ),
              low: year1[4].rank.adp,
              low_2qb: year1[4].rank.adp_2qb,
              high: year1[7].rank.adp,
              high_2qb: year1[7].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 3 && i < 8) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 3 && i < 8) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 3 && i < 8) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 4
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 3 && i < 8) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 4
              ),
            },
          });

          pickRanks.push({
            name: '2017 Late 1st',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 7 && i < 12) acc += val.rank.adp;
                  return acc;
                }, 0) / 4
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 7 && i < 12) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 4
              ),
              low: year1[8].rank.adp,
              low_2qb: year1[8].rank.adp_2qb,
              high: year1[11].rank.adp,
              high_2qb: year1[11].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 7 && i < 12) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 7 && i < 12) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 7 && i < 12) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 4
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 7 && i < 12) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 4
              ),
            },
          });

          // Second round
          pickRanks.push({
            name: '2017 2nd',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 2) acc += val.rank.adp;
                  return acc;
                }, 0) / 12
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 2) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 12
              ),
              low: year1[12].rank.adp,
              low_2qb: year1[12].rank.adp_2qb,
              high: year1[23].rank.adp,
              high_2qb: year1[23].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val) => {
                  if (val.round === 2) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val) => {
                  if (val.round === 2) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 2) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 12
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 2) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 12
              ),
            },
          });

          pickRanks.push({
            name: '2017 Early 2nd',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 11 && i < 16) acc += val.rank.adp;
                  return acc;
                }, 0) / 4
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 11 && i < 16) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 4
              ),
              low: year1[12].rank.adp,
              low_2qb: year1[12].rank.adp_2qb,
              high: year1[15].rank.adp,
              high_2qb: year1[15].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 11 && i < 16) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 11 && i < 16) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 11 && i < 16) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 4
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 11 && i < 16) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 4
              ),
            },
          });

          pickRanks.push({
            name: '2017 Mid 2nd',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 15 && i < 20) acc += val.rank.adp;
                  return acc;
                }, 0) / 4
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 15 && i < 20) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 4
              ),
              low: year1[16].rank.adp,
              low_2qb: year1[16].rank.adp_2qb,
              high: year1[19].rank.adp,
              high_2qb: year1[19].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 15 && i < 20) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 15 && i < 20) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 15 && i < 20) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 4
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 15 && i < 20) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 4
              ),
            },
          });

          pickRanks.push({
            name: '2017 Late 2nd',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 19 && i < 24) acc += val.rank.adp;
                  return acc;
                }, 0) / 4
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 19 && i < 24) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 4
              ),
              low: year1[20].rank.adp,
              low_2qb: year1[20].rank.adp_2qb,
              high: year1[23].rank.adp,
              high_2qb: year1[23].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 19 && i < 24) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 19 && i < 24) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 19 && i < 24) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 4
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 19 && i < 24) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 4
              ),
            },
          });

          // Third round
          pickRanks.push({
            name: '2017 3rd',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 3) acc += val.rank.adp;
                  return acc;
                }, 0) / 12
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 3) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 12
              ),
              low: year1[24].rank.adp,
              low_2qb: year1[24].rank.adp_2qb,
              high: year1[35].rank.adp,
              high_2qb: year1[35].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val) => {
                  if (val.round === 3) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val) => {
                  if (val.round === 3) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 3) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 12
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 3) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 12
              ),
            },
          });

          pickRanks.push({
            name: '2017 Early 3rd',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 23 && i < 28) acc += val.rank.adp;
                  return acc;
                }, 0) / 4
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 23 && i < 28) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 4
              ),
              low: year1[24].rank.adp,
              low_2qb: year1[24].rank.adp_2qb,
              high: year1[27].rank.adp,
              high_2qb: year1[27].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 23 && i < 28) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 23 && i < 28) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 23 && i < 28) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 4
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 23 && i < 28) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 4
              ),
            },
          });

          pickRanks.push({
            name: '2017 Mid 3rd',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 27 && i < 32) acc += val.rank.adp;
                  return acc;
                }, 0) / 4
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 27 && i < 32) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 4
              ),
              low: year1[28].rank.adp,
              low_2qb: year1[28].rank.adp_2qb,
              high: year1[31].rank.adp,
              high_2qb: year1[31].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 27 && i < 32) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 27 && i < 32) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 27 && i < 32) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 4
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 27 && i < 32) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 4
              ),
            },
          });

          pickRanks.push({
            name: '2017 Late 3rd',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 31 && i < 36) acc += val.rank.adp;
                  return acc;
                }, 0) / 4
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 31 && i < 36) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 4
              ),
              low: year1[32].rank.adp,
              low_2qb: year1[32].rank.adp_2qb,
              high: year1[35].rank.adp,
              high_2qb: year1[35].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 31 && i < 36) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 31 && i < 36) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 31 && i < 36) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 4
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 31 && i < 36) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 4
              ),
            },
          });

          // Fourth round
          pickRanks.push({
            name: '2017 4th',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 4) acc += val.rank.adp;
                  return acc;
                }, 0) / 12
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 4) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 12
              ),
              low: year1[36].rank.adp,
              low_2qb: year1[36].rank.adp_2qb,
              high: year1[47].rank.adp,
              high_2qb: year1[47].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val) => {
                  if (val.round === 4) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val) => {
                  if (val.round === 4) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 4) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 12
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val) => {
                  if (val.round === 4) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 12
              ),
            },
          });

          pickRanks.push({
            name: '2017 Early 4th',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 35 && i < 40) acc += val.rank.adp;
                  return acc;
                }, 0) / 4
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 35 && i < 40) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 4
              ),
              low: year1[36].rank.adp,
              low_2qb: year1[36].rank.adp_2qb,
              high: year1[39].rank.adp,
              high_2qb: year1[39].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 35 && i < 40) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 35 && i < 40) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 35 && i < 40) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 4
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 35 && i < 40) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 4
              ),
            },
          });

          pickRanks.push({
            name: '2017 Mid 4th',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 39 && i < 44) acc += val.rank.adp;
                  return acc;
                }, 0) / 4
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 39 && i < 44) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 4
              ),
              low: year1[40].rank.adp,
              low_2qb: year1[40].rank.adp_2qb,
              high: year1[43].rank.adp,
              high_2qb: year1[43].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 39 && i < 44) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 39 && i < 44) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 39 && i < 44) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 4
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 39 && i < 44) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 4
              ),
            },
          });

          pickRanks.push({
            name: '2017 Late 4th',
            rank: {
              time: new Date(),
              adp: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 43 && i < 48) acc += val.rank.adp;
                  return acc;
                }, 0) / 4
              ),
              adp_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 43 && i < 48) acc += val.rank.adp_2qb;
                  return acc;
                }, 0) / 4
              ),
              low: year1[44].rank.adp,
              low_2qb: year1[44].rank.adp_2qb,
              high: year1[47].rank.adp,
              high_2qb: year1[47].rank.adp_2qb,
              stdev: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 43 && i < 48) {
                    acc.push(val.rank.adp);
                  }
                  return acc;
                }, [])
              ),
              stdev_2qb: standardDeviation(
                year1.reduce((acc, val, i) => {
                  if (i > 43 && i < 48) {
                    acc.push(val.rank.adp_2qb);
                  }
                  return acc;
                }, [])
              ),
              value: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 43 && i < 48) {
                    acc += val.rank.value;
                  }
                  return acc;
                }, 0) / 4
              ),
              value_2qb: Math.round(
                year1.reduce((acc, val, i) => {
                  if (i > 43 && i < 48) {
                    acc += val.rank.value_2qb;
                  }
                  return acc;
                }, 0) / 4
              ),
            },
          });

          const futureYears = ['2018', '2019', '2020', '2021'];

          const absolutePicks = pickRanks.slice(0, 48);

          futureYears.forEach((year, i) => {
            if (i === 0) {
              absolutePicks.some((pick, index) => {
                if (index > 47) return false;
                const pickNum = index + 1;
                pickRanks.push({
                  name: `${year} Pick ${pickNum}`,
                  rank: {
                    time: new Date(),
                    adp: parseFloat((pick.rank.adp * 1.2).toFixed(1)),
                    adp_2qb: parseFloat((pick.rank.adp_2qb * 1.2).toFixed(1)),
                    low: parseFloat((pick.rank.low * 1.2).toFixed(1)),
                    low_2qb: parseFloat((pick.rank.low_2qb * 1.2).toFixed(1)),
                    high: parseFloat((pick.rank.high * 1.2).toFixed(1)),
                    high_2qb: parseFloat((pick.rank.high_2qb * 1.2).toFixed(1)),
                    stdev: pick.rank.stdev,
                    stdev_2qb: pick.rank.stdev_2qb,
                    value: parseInt((pick.rank.value * 0.8).toFixed(0)),
                    value_2qb: parseInt((pick.rank.value_2qb * 0.8).toFixed(0)),
                  },
                });
              });
            }

            let x = 48 + i * 16;

            pickRanks.push({
              name: `${year} 1st`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 52 + i * 16;

            pickRanks.push({
              name: `${year} 2nd`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 56 + i * 16;

            pickRanks.push({
              name: `${year} 3rd`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 60 + i * 16;

            pickRanks.push({
              name: `${year} 4th`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 48 + 1 + i * 16;

            pickRanks.push({
              name: `${year} Early 1st`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 52 + 1 + i * 16;

            pickRanks.push({
              name: `${year} Early 2nd`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 56 + 1 + i * 16;

            pickRanks.push({
              name: `${year} Early 3rd`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 60 + 1 + i * 16;

            pickRanks.push({
              name: `${year} Early 4th`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 48 + 2 + i * 16;

            pickRanks.push({
              name: `${year} Mid 1st`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 52 + 2 + i * 16;

            pickRanks.push({
              name: `${year} Mid 2nd`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 56 + 2 + i * 16;

            pickRanks.push({
              name: `${year} Mid 3rd`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 60 + 2 + i * 16;

            pickRanks.push({
              name: `${year} Mid 4th`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 48 + 3 + i * 16;

            pickRanks.push({
              name: `${year} Late 1st`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 52 + 3 + i * 16;

            pickRanks.push({
              name: `${year} Late 2nd`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 56 + 3 + i * 16;

            pickRanks.push({
              name: `${year} Late 3rd`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });

            x = 60 + 3 + i * 16;

            pickRanks.push({
              name: `${year} Late 4th`,
              rank: {
                time: new Date(),
                adp: parseFloat((pickRanks[x].rank.adp * 1.2).toFixed(1)),
                adp_2qb: parseFloat((pickRanks[x].rank.adp_2qb * 1.2).toFixed(1)),
                low: parseFloat((pickRanks[x].rank.low * 1.2).toFixed(1)),
                low_2qb: parseFloat((pickRanks[x].rank.low_2qb * 1.2).toFixed(1)),
                high: parseFloat((pickRanks[x].rank.high * 1.2).toFixed(1)),
                high_2qb: parseFloat((pickRanks[x].rank.high_2qb * 1.2).toFixed(1)),
                stdev: pickRanks[x].rank.stdev,
                stdev_2qb: pickRanks[x].rank.stdev_2qb,
                value: parseInt((pickRanks[x].rank.value * 0.8).toFixed(0)),
                value_2qb: parseInt((pickRanks[x].rank.value_2qb * 0.8).toFixed(0)),
              },
            });
          });

          result.forEach(p => {
            if (p.position !== 'PICK') {
              const newPlayer = p;
              const match = playersFinal.find(
                x => x.name.toLowerCase() === newPlayer.name.toLowerCase()
              );
              const newRank = {};
              newRank.time = new Date();
              newRank.adp = match ? match.rank : null;
              newRank.adp_2qb = match ? match.super : null;
              newRank.low = match ? match.best : null;
              newRank.low_2qb = match ? match.best_2qb : null;
              newRank.high = match ? match.worst : null;
              newRank.high_2qb = match ? match.worst_2qb : null;
              newRank.stdev = match ? match.stdev : null;
              newRank.stdev_2qb = match ? match.stdev_2qb : null;
              newRank.value = match ? match.value : 0;
              newRank.value_2qb = match ? match.value_2qb : null;
              newRank.aav = match ? match.aav : 0;
              newRank.aav_2qb = match ? match.aav_2qb : 0;
              if (!newPlayer.adp) newPlayer.adp = [];
              newPlayer.trend = newRank.adp &&
                newPlayer.adp &&
                newPlayer.adp[0] &&
                newPlayer.adp[0].adp
                ? parseFloat((newPlayer.adp[0].adp - newRank.adp).toFixed(1))
                : 0;
              newPlayer.trend_2qb = newRank.adp_2qb &&
                newPlayer.adp &&
                newPlayer.adp[0] &&
                newPlayer.adp[0].adp_2qb
                ? parseFloat((newPlayer.adp[0].adp_2qb - newRank.adp_2qb).toFixed(1))
                : 0;
              newPlayer.adp.unshift(newRank);
              //   newPlayer.adp[0] = newRank;
              Players.update({ id: newPlayer.id }, newPlayer);
            } else {
              const match = pickRanks.find(x => x.name === p.name);
              if (match) {
                const newPlayer = p;
                newPlayer.trend = match.rank.adp &&
                  newPlayer.adp &&
                  newPlayer.adp[0] &&
                  newPlayer.adp[0].adp
                  ? parseInt(newPlayer.adp[0].adp - match.rank.adp)
                  : 0;
                newPlayer.trend_2qb = match.rank.adp_2qb &&
                  newPlayer.adp &&
                  newPlayer.adp[0] &&
                  newPlayer.adp[0].adp_2qb
                  ? parseInt(newPlayer.adp[0].adp_2qb - match.rank.adp)
                  : 0;
                newPlayer.adp.unshift(match.rank);
                Players.update({ id: newPlayer.id }, newPlayer);
              }
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
//
getFantasyProsRankings();
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
      Meteor.call('players.getAllPlayers', (err, result) => {
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
              newPlayer.status = match.status;
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
              newPlayer.inactive = false;
            } else {
              newPlayer.inactive = true;
            }
            Players.update({ id: newPlayer.id }, newPlayer);
          } else {
            const newPlayer = p;
            newPlayer.inactive = false;
            Players.update({ id: newPlayer.id }, newPlayer);
          }
        });
      });
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
