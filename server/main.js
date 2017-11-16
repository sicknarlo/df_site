import '../imports/api/players.js';
import '../imports/api/teams.js';
import '../imports/api/votes.js';
import '../imports/api/draftMateRankings.js';
import '../imports/api/drafts.js';
import '../imports/api/trades.js';
import '../imports/api/adp.js';
import '../imports/api/cache.js';
import { Players } from '../imports/api/players.js';
import { Logs } from '../imports/api/logs.js';
import { Meteor } from 'meteor/meteor';
import cron from 'cron';
import rp from 'request-promise';
import cheerio from 'cheerio';
import cache from 'memory-cache';
import { aav_raw } from './aav';

function cleanNameNewPlayer(name) {
  if (name === 'Mitchell Trubisky') return 'Mitch Trubisky';
  if (name === 'Robert Kelley') return 'Rob Kelley';
  return name.replace(' Jr.', '').replace(/\./g, '').replace(/\\/g, '');
}

function cleanName(name) {
  if (name === 'Mitchell Trubisky') return 'Mitch Trubisky';
  if (name === 'Robert Kelley') return 'Rob Kelley';
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
      Logs.insert({ createdAt: new Date(), type: 'updateplayers', result: 'success', data: null });
      const players = JSON.parse(x).players.player.filter(y => positions.indexOf(y.position) > -1);
      const usedPlayers = [];
      Meteor.call('players.getAllPlayers', (err, result) => {
        result.forEach(p => {
          if (p.position !== 'PICK') {
            const newPlayer = p;
            const match = players.find(z => parseInt(z.id) === parseInt(newPlayer.id));
            if (match) {
              n++;
              usedPlayers.push(match.id);
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
              newPlayer.inactive = false;
            } else {
              newPlayer.inactive = true;
            }
            if (newPlayer.adp.length === 0) {
                newPlayer.adp = [{
                    time: new Date(),
                    "adp" : 460.3,
                    "adp_2qb" : 566,
                    "low" : 404.4,
                    "low_2qb" : 489.4,
                    "high" : 483.1,
                    "high_2qb" : 601.1,
                    "stdev" : 14.71,
                    "stdev_2qb" : 20.65,
                    "value" : 26,
                    "value_2qb" : 24
                }];
            }
            Players.update({ id: newPlayer.id }, newPlayer);
          }
        });
      });
    //   console.log(usedPlayers);
      players.forEach(p => {
        //   console.log(usedPlayers.indexOf(p.name) > -1);
        if (usedPlayers.indexOf(p.id) === -1) {
          const newPlayer = {};
          newPlayer.id = p.id;
          newPlayer.name = cleanNameNewPlayer(`${p.name.split(', ')[1]} ${p.name.split(', ')[0]}`);
          newPlayer.birthdate = new Date(parseInt(p.birthdate) * 1000);
          newPlayer.draft_year = p.draft_year;
          newPlayer.nfl_id = p.nfl_id;
          newPlayer.rotoworld_id = p.rotoworld_id;
          newPlayer.stats_id = p.stats_id;
          newPlayer.position = p.position;
          newPlayer.stats_global_id = p.stats_global_id;
          newPlayer.espn_id = p.espn_id;
          newPlayer.kffl_id = p.kffl_id;
          newPlayer.weight = p.weight;
          newPlayer.draft_team = p.draft_team;
          newPlayer.draft_pick = p.draft_pick;
          newPlayer.college = p.college;
          newPlayer.height = p.height;
          newPlayer.jersey = p.jersey;
          newPlayer.twitter_username = p.twitter_username;
          newPlayer.sportsdata_id = p.sportsdata_id;
          newPlayer.team = p.team;
          newPlayer.cbs_id = p.cbs_id;
          newPlayer.inactive = false;
          newPlayer.rankings = [];
          const newRank = {};
          newRank.time = new Date();
          newRank.adp = 350;
          newRank.adp_2qb = 350;
          newRank.low = 350;
          newRank.low_2qb = 350;
          newRank.high = 350;
          newRank.high_2qb = 350;
          newRank.stdev = 0;
          newRank.stdev_2qb = 0;
          newRank.value = 0;
          newRank.value_2qb = 0;
          newRank.aav = 0;
          newRank.aav_2qb = 0;
          newRank.rookie = null;
          newRank.rookie_2qb = null;
          newPlayer.adp = [newRank];
          newPlayer.rankings = [];
          newPlayer.status = p.status;
          Players.insert(newPlayer);
        }
      });
    })
  )
  .catch((err) => Logs.insert({ createdAt: new Date(), type: 'updateplayers', result: 'fail', data: err }));
}

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
  const draftYears = ['2018', '2019', '2020', '2021', '2022'];

  const options = {
    uri: 'http://partners.fantasypros.com/api/v1/consensus-rankings.php?experts=show&sport=NFL&year=2017&week=0&id=1015&scoring=PPR&position=ALL&type=STK',
    // uri: 'http://partners.fantasypros.com/api/v1/consensus-rankings.php?experts=show&sport=NFL&year=2017&week=0&id=1015&position=ALL&type=STK&scoring=&filters=1015:1016:1017:1024:405',
    transform(body) {
      // return cheerio.load(body);
      return JSON.parse(body);
    },
  };

  const options2 = {
    uri: 'http://www03.myfantasyleague.com/2017/export?TYPE=aav&JSON=1',
  };

  const aav = aav_raw.map(x => parseFloat(x.averageValue));

  const superScore = {
  	'QB': (ecr) => parseFloat(((0.0162 * Math.pow(ecr, 1.66)) - 0.69).toFixed(2)),
  	'RB': (ecr) => parseFloat(((1.6912 * Math.pow(ecr, 0.9441)) - 0.69).toFixed(2)),
  	'WR': (ecr) => parseFloat(((1.6912 * Math.pow(ecr, 0.9441)) - 0.69).toFixed(2)),
  	'TE': (ecr) => parseFloat(((1.6912 * Math.pow(ecr, 0.9441)) - 0.69).toFixed(2)),
  }

  rp(options)
    .then(
      Meteor.bindEnvironment(function (json) {
        Logs.insert({
          createdAt: new Date(),
          type: 'fpranksucccess',
          data: {
            playerLength: json.players.length,
          }
        });

        let updatedPlayers = 0;
        // Process html like you would with jQuery...
        // const raw = $('[class^="mpb-player"]');
        const players = json.players
          .filter(y => positions.indexOf(y.player_position_id) > -1).map((x, i) => {
            const name = cleanName(x.player_name);
            const best = parseInt(x.rank_min);
            const worst = parseInt(x.rank_max);
            const rank = parseFloat(x.rank_ave);
            const stdev = parseFloat(x.rank_std);
            const pos = x.player_position_id;
            return {
              name,
              best,
              worst,
              rank,
              stdev,
              pos,
              super: superScore[pos](rank),
            };
            // if (x.children[2].children[0].children[0]) {
            //   const name = cleanName(x.children[2].children[0].children[0].data);
            //   const best = parseInt(x.children[8].children[0].data);
            //   const worst = parseInt(x.children[10].children[0].data);
            //   const rank = parseFloat(x.children[12].children[0].data);
            //   const stdev = parseFloat(x.children[14].children[0].data);
            //   const pos = x.children[4].children[0].data;
            //   const isQb = x.children[4].children[0].data.indexOf('QB') > -1;
            //   const superScore = isQb ? rank - 35 : rank;
            //   return {
            //     name,
            //     best,
            //     worst,
            //     rank,
            //     stdev,
            //     pos,
            //     superScore,
            //   };
            // }
          });

        const playersFinal = players.map((x) => {
          const obj = x;
          const diff = obj.super - obj.rank;
          obj.stdev_2qb = obj.stdev;
          obj.best_2qb = obj.best + diff > 1 ? Math.floor(obj.best + diff) : 1;
          obj.worst_2qb = obj.worst + diff > 1 ? Math.ceil(obj.worst) + diff : 2;
          return obj;
        });
        Meteor.call('players.getAllPlayers', (err, result) => {
          try {
          Logs.insert({ lengthy: result.length });
          playersFinal.forEach(player => {
            const dbPlayer = result.find(x => x.name && (x.name.toLowerCase() === player.name.toLowerCase()));
            if (dbPlayer) player.player = dbPlayer;
            if (dbPlayer && dbPlayer.status === 'R') player.isRookie = true;
          });

          Logs.insert({ msg: "made it past 1"});

          // Sort players by rank and assign value
          playersFinal.sort((a, b) => a.rank - b.rank);
          let last = null;
          for (let y = 0; y < playersFinal.length; y++) {

            playersFinal[y].aav = parseFloat((aav[y] / 1000).toFixed(5));
            playersFinal[y].value = parseInt(10500 * Math.pow(2.71828182845904, (-0.0234 * playersFinal[y].rank)));
            // last = playersFinal[y];
          }

          // Sort players by 2qb rank and assign values
          playersFinal.sort((a, b) => a.super - b.super);
          last = null;
          let rank = 1;
          for (let y = 0; y < playersFinal.length; y++) {
            if (last && playersFinal[y].super !== last.super) {
              rank++;
            }
            playersFinal[y].aav_2qb = parseFloat((aav[y] / 1000).toFixed(5));
            playersFinal[y].value_2qb = parseInt(10500 * Math.pow(2.71828182845904, (-0.0234 * rank)));
            last = playersFinal[y];
          }

          const rookies = playersFinal.filter(x => x.isRookie).sort((a, b) => a.rank - b.rank);

          rookies.forEach((x, i) => {
            const p = playersFinal.findIndex(y => x.name === y.name);
            if (p) {
              playersFinal[p].rookie = i + 1;
              //   console.log(playersFinal[p]);
            }
          });
          const rookies_2qb = playersFinal
            .filter(x => x.isRookie)
            .sort((a, b) => a.super - b.super);

          rookies_2qb.forEach((x, i) => {
            const p = playersFinal.findIndex(y => x.name === y.name);
            if (p) {
              playersFinal[p].rookie_2qb = i + 1;
            }
          });
          const round1 = [];
          const round2 = [];
          const round3 = [];
          const round4 = [];

          let lastDefined = null;
          for (var y = 0; y < 48; y++) {
            if (rookies[y] && rookies_2qb[y]) lastDefined = y;
            if (y < 12) round1.push([rookies[lastDefined], rookies_2qb[lastDefined]]);
            if (y > 11 && y < 24) round2.push([rookies[lastDefined], rookies_2qb[lastDefined]]);
            if (y > 23 && y < 36) round3.push([rookies[lastDefined], rookies_2qb[lastDefined]]);
            if (y > 35 && y < 48) round4.push([rookies[lastDefined], rookies_2qb[lastDefined]]);
          }

          const year1 = [];

          round1.forEach((x, index) =>
            year1.push({
              name: `2018 Pick ${index + 1}`,
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
              name: `2018 Pick ${index + 1 + 12}`,
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
              name: `2018 Pick ${index + 1 + 24}`,
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
              name: `2018 Pick ${index + 1 + 36}`,
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
            name: '2018 1st',
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
            name: '2018 Early 1st',
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
            name: '2018 Mid 1st',
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
            name: '2018 Late 1st',
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
            name: '2018 2nd',
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
            name: '2018 Early 2nd',
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
            name: '2018 Mid 2nd',
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
            name: '2018 Late 2nd',
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
            name: '2018 3rd',
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
            name: '2018 Early 3rd',
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
            name: '2018 Mid 3rd',
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
            name: '2018 Late 3rd',
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
            name: '2018 4th',
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
            name: '2018 Early 4th',
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
            name: '2018 Mid 4th',
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
            name: '2018 Late 4th',
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

          const futureYears = ['2019', '2020', '2021', '2022'];

          const absolutePicks = pickRanks.slice(0, 48);

          futureYears.forEach((year, i) => {
            let x = 0;
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
            let foo = 112;
            let inc = 0;

            x = i === 0 ? 48 + inc : foo + (i - 1) * 16;

            foo++;
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
            x = i === 0 ? 52 + inc : foo + (i - 1) * 16;

            foo++;

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
            x = i === 0 ? 56 + inc : foo + (i - 1) * 16;

            foo++;

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
            x = i === 0 ? 60 + inc : foo + (i - 1) * 16;

            foo++;

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
            inc++;
            x = i === 0 ? 48 + inc : foo + (i - 1) * 16;

            foo++;

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
            x = i === 0 ? 52 + inc : foo + (i - 1) * 16;

            foo++;

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
            x = i === 0 ? 56 + inc : foo + (i - 1) * 16;

            foo++;

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
            x = i === 0 ? 60 + inc : foo + (i - 1) * 16;

            foo++;

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
            inc++;
            x = i === 0 ? 48 + inc : foo + (i - 1) * 16;

            foo++;

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
            x = i === 0 ? 52 + inc : foo + (i - 1) * 16;

            foo++;

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
            x = i === 0 ? 56 + inc : foo + (i - 1) * 16;

            foo++;

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
            x = i === 0 ? 60 + inc : foo + (i - 1) * 16;

            foo++;

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
            inc++;
            x = i === 0 ? 48 + inc : foo + (i - 1) * 16;

            foo++;

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
            x = i === 0 ? 52 + inc : foo + (i - 1) * 16;

            foo++;

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
            x = i === 0 ? 56 + inc : foo + (i - 1) * 16;

            foo++;

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
            x = i === 0 ? 60 + inc : foo + (i - 1) * 16;

            foo++;

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

          //   console.log(pickRanks.map((x, i) => [x.name, i]))
          const usedPicks = [];
          Logs.insert({ addphase: 'addphase' });
          result.forEach(p => {
            if (p.position !== 'PICK') {
              const newPlayer = p;
              const match = playersFinal.find(
                x => x.name.toLowerCase() === newPlayer.name.toLowerCase()
              );
              Logs.insert({ msg: "made it past 2"});
              const newRank = {};
              newRank.time = new Date();
              newRank.adp = match ? match.rank : 350;
              newRank.adp_2qb = match ? match.super : 350;
              newRank.low = match ? match.best : 350;
              newRank.low_2qb = match ? match.best_2qb : 350;
              newRank.high = match ? match.worst : 350;
              newRank.high_2qb = match ? match.worst_2qb : 350;
              newRank.stdev = match ? match.stdev : 0;
              newRank.stdev_2qb = match ? match.stdev_2qb : 0;
              newRank.value = match ? match.value : 0;
              newRank.value_2qb = match ? match.value_2qb : 0;
              newRank.aav = match ? match.aav : 0;
              newRank.aav_2qb = match ? match.aav_2qb : 0;
              newRank.rookie = match && match.rookie ? match.rookie : null;
              newRank.rookie_2qb = match && match.rookie_2qb ? match.rookie_2qb : null;
              if (!newPlayer.adp) newPlayer.adp = [];
              newPlayer.trend = newRank.adp &&
                newPlayer.adp &&
                newPlayer.adp[0] &&
                newPlayer.adp[0].adp
                ? parseFloat((newPlayer.adp[0].adp - newRank.adp).toFixed(1))
                : 0;
              const curr3 = new Date();
              curr3.setMonth(curr3.getMonth() - 3);
              const curr6 = new Date();
              curr6.setMonth(curr6.getMonth() - 3);

              const month3 = newPlayer.adp.filter(x => x.time.getMonth() === curr3.getMonth())[0];
              const month6 = newPlayer.adp.filter(x => x.time.getMonth() === curr6.getMonth())[0];
              // console.log(month3);

              newPlayer.trend3 = newRank.adp &&
                newPlayer.adp &&
                month3 &&
                month3.adp
                ? parseFloat((month3.adp - newRank.adp).toFixed(1))
                : 0;
              newPlayer.trend6 = newRank.adp &&
                newPlayer.adp &&
                month6 &&
                month6.adp
                ? parseFloat((month6.adp - newRank.adp).toFixed(1))
                : 0;
              newPlayer.trend_2qb = newRank.adp_2qb &&
                newPlayer.adp &&
                newPlayer.adp[0] &&
                newPlayer.adp[0].adp_2qb
                ? parseFloat((newPlayer.adp[0].adp_2qb - newRank.adp_2qb).toFixed(1))
                : 0;
              newPlayer.trend3_2qb = newRank.adp_2qb &&
                newPlayer.adp &&
                month3 &&
                month3.adp_2qb
                ? parseFloat((month3.adp_2qb - newRank.adp_2qb).toFixed(1))
                : 0;
              newPlayer.trend6_2qb = newRank.adp_2qb &&
                newPlayer.adp &&
                month6 &&
                month6.adp_2qb
                ? parseFloat((month6.adp_2qb - newRank.adp_2qb).toFixed(1))
                : 0;
              // newPlayer.adp = newPlayer.adp.slice(0, newPlayer.adp.length - 1);

              // Update buy index
              newPlayer.buy_index = newRank.adp &&
                newPlayer.rankings &&
                newPlayer.rankings[0] &&
                newPlayer.rankings[0].rank
                ? newRank.adp - newPlayer.rankings[0].rank
                : 0;
              newPlayer.buy_index_2qb = newRank.adp_2qb &&
                newPlayer.rankings &&
                newPlayer.rankings[0] &&
                newPlayer.rankings[0].rank_2qb
                ? newRank.adp_2qb - newPlayer.rankings[0].rank_2qb
                : 0;

              // Update buy index
              newPlayer.win_now_index = newRank.adp &&
                newPlayer.rankings &&
                newPlayer.rankings[0] &&
                newPlayer.rankings[0].win_now
                ? newRank.adp - newPlayer.rankings[0].win_now
                : 0;
              newPlayer.win_now_index_2qb = newRank.adp_2qb &&
                newPlayer.rankings &&
                newPlayer.rankings[0] &&
                newPlayer.rankings[0].win_now_2qb
                ? newRank.adp_2qb - newPlayer.rankings[0].win_now_2qb
                : 0;
              newPlayer.adp.unshift(newRank);
              const updateStatus = Players.update({ _id: newPlayer._id }, newPlayer);
              if (updateStatus !== 1) {
                Logs.insert({ createdAd: new Date(), type: 'fprankplayerfail', data: { text: 'player failed to update', pid: newPlayer._id } });
              }
              if (updateStatus === 1) updatedPlayers++;
            } else {
              const match = pickRanks.find(x => x.name === p.name);
              if (match) {
                usedPicks.push(match.name);
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
                  newPlayer.trend3 = match.rank.adp &&
                    newPlayer.adp &&
                    newPlayer.adp[2] &&
                    newPlayer.adp[2].adp
                    ? parseInt(newPlayer.adp[2].adp - match.rank.adp)
                    : 0;
                  newPlayer.trend3_2qb = match.rank.adp_2qb &&
                    newPlayer.adp &&
                    newPlayer.adp[2] &&
                    newPlayer.adp[2].adp_2qb
                    ? parseInt(newPlayer.adp[2].adp_2qb - match.rank.adp)
                    : 0;
                  newPlayer.trend6 = match.rank.adp &&
                    newPlayer.adp &&
                    newPlayer.adp[5] &&
                    newPlayer.adp[5].adp
                    ? parseInt(newPlayer.adp[5].adp - match.rank.adp)
                    : 0;
                  newPlayer.trend6_2qb = match.rank.adp_2qb &&
                    newPlayer.adp &&
                    newPlayer.adp[5] &&
                    newPlayer.adp[5].adp_2qb
                    ? parseInt(newPlayer.adp[5].adp_2qb - match.rank.adp)
                    : 0;
                //   newPlayer.adp = newPlayer.adp.slice(0, newPlayer.adp.length - 1);
                // newPlayer.adp[0] = match.rank;
                newPlayer.adp.unshift(match.rank);
                const updateStatus = Players.update({ _id: newPlayer._id }, newPlayer);
                // if (updateStatus !== 1) {
                //   Logs.insert({ createdAd: new Date(), type: 'fprankplayerfail', data: { text: 'player failed to update', pid: newPlayer._id } });
                // }
                if (updateStatus === 1) updatedPlayers ++;
              }
            }
          });
          pickRanks.forEach(pick => {
              if (usedPicks.indexOf(pick.name) === -1) {
                  console.log(pick.name);
                  const newPick = pick;
                  newPick.position = 'PICK';
                  newPick.team = 'PICK';
                  newPick.status = 'R';
                  newPick.trend_2qb = 0;
                  newPick.trend = 0;
                  newPick.adp = [pick.rank];
                  newPick.trend3 = 0;
                  newPick.trend3_2qb = 0;
                  newPick.trend6 = 0;
                  newPick.trend6_2qb = 0;
                  Players.insert(newPick);
              }
          });
        }
        catch (e) {
          Logs.insert({ error: e.message, stack: e.stack });
        }
        });
        Logs.insert({ createdAt: new Date(), type: 'getfprankings', result: 'success', data: { updateCount: updatedPlayers } });
      })
    )
    .catch(
      Meteor.bindEnvironment(function (err) {
        // Crawling failed or Cheerio choked...
        Logs.insert({ createdAt: new Date(), type: 'fprankfail', data: err });
        console.log(err, 'err');
      })
    );
}

function updateRankings() {
  const options = {
    // uri: 'http://partners.fantasypros.com/api/v1/consensus-rankings.php?experts=show&sport=NFL&year=2017&week=0&id=1015&position=ALL&type=STK',
    uri: 'http://partners.fantasypros.com/api/v1/consensus-rankings.php?experts=show&sport=NFL&year=2017&week=0&id=1015&position=ALL&type=STK&scoring=&filters=1015:1016:1017:1024:405',
    transform(body) {
      // return cheerio.load(body);
      return JSON.parse(body);
    },
  };

  const superScore = {
  	'QB': (ecr) => parseFloat(((0.0162 * Math.pow(ecr, 1.66)) - 0.69).toFixed(2)),
  	'RB': (ecr) => parseFloat(((1.6912 * Math.pow(ecr, 0.9441)) - 0.69).toFixed(2)),
  	'WR': (ecr) => parseFloat(((1.6912 * Math.pow(ecr, 0.9441)) - 0.69).toFixed(2)),
  	'TE': (ecr) => parseFloat(((1.6912 * Math.pow(ecr, 0.9441)) - 0.69).toFixed(2)),
  }

  rp(options)
    .then(
      Meteor.bindEnvironment(function (json) {
        // Process html like you would with jQuery...
        // const raw = $('[class^="mpb-player"]');
        const players = json.players
          .filter(y => positions.indexOf(y.player_position_id) > -1).map((x) => {
            const name = cleanName(x.player_name);
            const rank = parseFloat(x.rank_ave);
            const pos = x.player_position_id;
            return {
              name,
              rank,
              pos,
              super: superScore[pos](rank),
            };
            // if (x.children[2].children[0].children[0]) {
            //   const name = cleanName(x.children[2].children[0].children[0].data);
            //   const best = parseInt(x.children[8].children[0].data);
            //   const worst = parseInt(x.children[10].children[0].data);
            //   const rank = parseFloat(x.children[12].children[0].data);
            //   const stdev = parseFloat(x.children[14].children[0].data);
            //   const pos = x.children[4].children[0].data;
            //   const isQb = x.children[4].children[0].data.indexOf('QB') > -1;
            //   const superScore = isQb ? rank - 35 : rank;
            //   return {
            //     name,
            //     best,
            //     worst,
            //     rank,
            //     stdev,
            //     pos,
            //     superScore,
            //   };
            // }
          });
        const playersFinal = players.map((x) => {
          const obj = x;
          const diff = obj.super - obj.rank;
          obj.stdev_2qb = obj.stdev;
          obj.best_2qb = obj.best + diff > 1 ? Math.floor(obj.best + diff) : 1;
          obj.worst_2qb = obj.worst + diff > 1 ? Math.ceil(obj.worst) + diff : 2;
          return obj;
        });

        const rookies = playersFinal.filter(x => x.isRookie).sort((a, b) => a.rank - b.rank);

        rookies.forEach((x, i) => {
          const p = playersFinal.findIndex(y => x.name === y.name);
          if (p) {
            playersFinal[p].rookie = i + 1;
            //   console.log(playersFinal[p]);
          }
        });
        const rookies_2qb = playersFinal
          .filter(x => x.isRookie)
          .sort((a, b) => a.super - b.super);

        rookies_2qb.forEach((x, i) => {
          const p = playersFinal.findIndex(y => x.name === y.name);
          if (p) {
            playersFinal[p].rookie_2qb = i + 1;
          }
        });
        Meteor.call('players.getAllPlayers', (err, result) => {
          playersFinal.forEach(player => {
            const dbPlayer = result.find(x => x.name.toLowerCase() === player.name.toLowerCase());
            if (dbPlayer) player.player = dbPlayer;
            if (dbPlayer && dbPlayer.status === 'R') player.isRookie = true;
          });
          result.forEach(p => {
            if (p.position !== 'PICK') {
              const newPlayer = p;
              const match = playersFinal.find(
                x => x.name.toLowerCase() === newPlayer.name.toLowerCase()
              );
              const newRank = {};
              newRank.time = new Date();
              newRank.rank = match ? match.rank : 350;
              newRank.rank_2qb = match ? match.super : 350;
              newRank.rookie = match && match.rookie ? match.rookie : null;
              newRank.rookie_2qb = match && match.rookie_2qb ? match.rookie_2qb : null;
              if (!newPlayer.rankings) newPlayer.rankings = [];
              newPlayer.rankings.unshift(newRank);
                // newPlayer.rankings[0] = newRank;
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

function updateRedraft() {
  const options = {
    // uri: 'http://partners.fantasypros.com/api/v1/consensus-rankings.php?experts=show&sport=NFL&year=2017&week=0&id=1015&position=ALL&type=STK',
    uri: 'http://partners.fantasypros.com/api/v1/consensus-rankings.php?experts=show&sport=NFL&year=2017&week=0&id=1015&position=ALL',
    transform(body) {
      // return cheerio.load(body);
      return JSON.parse(body);
    },
  };

  const superScore = {
  	'QB': (ecr) => parseFloat(((0.0162 * Math.pow(ecr, 1.66)) - 0.69).toFixed(2)),
  	'RB': (ecr) => parseFloat(((1.6912 * Math.pow(ecr, 0.9441)) - 0.69).toFixed(2)),
  	'WR': (ecr) => parseFloat(((1.6912 * Math.pow(ecr, 0.9441)) - 0.69).toFixed(2)),
  	'TE': (ecr) => parseFloat(((1.6912 * Math.pow(ecr, 0.9441)) - 0.69).toFixed(2)),
  }

  rp(options)
    .then(
      Meteor.bindEnvironment(function (json) {
        // Process html like you would with jQuery...
        // const raw = $('[class^="mpb-player"]');
        const players = json.players
          .filter(y => positions.indexOf(y.player_position_id) > -1).map((x, i) => {
            const name = cleanName(x.player_name);
            const rank = parseFloat(x.rank_ave);
            const pos = x.player_position_id;
            return {
              name,
              rank,
              pos,
              super: superScore[pos](rank),
            };
            // if (x.children[2].children[0].children[0]) {
            //   const name = cleanName(x.children[2].children[0].children[0].data);
            //   const best = parseInt(x.children[8].children[0].data);
            //   const worst = parseInt(x.children[10].children[0].data);
            //   const rank = parseFloat(x.children[12].children[0].data);
            //   const stdev = parseFloat(x.children[14].children[0].data);
            //   const pos = x.children[4].children[0].data;
            //   const isQb = x.children[4].children[0].data.indexOf('QB') > -1;
            //   const superScore = isQb ? rank - 35 : rank;
            //   return {
            //     name,
            //     best,
            //     worst,
            //     rank,
            //     stdev,
            //     pos,
            //     superScore,
            //   };
            // }
          });
        Meteor.call('players.getAllPlayers', (err, result) => {
          players.forEach(player => {
            const dbPlayer = result.find(x => x.name.toLowerCase() === player.name.toLowerCase());
            if (dbPlayer) player.player = dbPlayer;
            if (dbPlayer && dbPlayer.status === 'R') player.isRookie = true;
          });

          result.forEach(p => {
            if (p.position !== 'PICK') {
              const newPlayer = p;
              const match = players.find(
                x => x.name.toLowerCase() === newPlayer.name.toLowerCase()
              );
              const newRank = {};
              newRank.time = new Date();
              newRank.rank = match ? match.rank : 350;
              newRank.rank_2qb = match ? match.super : 350;
              if (newPlayer.rankings[0]) {
                newPlayer.rankings[0].redraft = newRank.rank;
                newPlayer.rankings[0].redraft_2qb = newRank.rank_2qb;
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

// updatePlayers();
// getFantasyProsRankings();
// updateRankings();
// updateRedraft();


const job1 = new cron.CronJob({
  // cronTime: '00 30 2 * * *',
  cronTime: '00 30 3 * * 3',
  onTick: Meteor.bindEnvironment(function () {
    getFantasyProsRankings();
  }),
  start: true,
  timeZone: 'America/Los_Angeles',
});

const job3 = new cron.CronJob({
  // cronTime: '00 30 2 * * *',
  cronTime: '00 30 2 * * 3',
  onTick: Meteor.bindEnvironment(function () {
    updateRankings();
  }),
  start: true,
  timeZone: 'America/Los_Angeles',
});

const job4 = new cron.CronJob({
  // cronTime: '00 30 2 * * *',
  cronTime: '00 30 4 * * 3',
  onTick: Meteor.bindEnvironment(function () {
    updateRedraft();
  }),
  start: true,
  timeZone: 'America/Los_Angeles',
});

const job2 = new cron.CronJob({
  // cronTime: '00 30 2 * * *',
  cronTime: '00 30 1 * * 2',
  onTick: Meteor.bindEnvironment(function () {
    updatePlayers();
  }),
  start: true,
  timeZone: 'America/Los_Angeles',
});

cache.clear();
