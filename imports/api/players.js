import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import PValues from '../ui/ADPConst.jsx';

const currentMonthStandard = PValues.ppr.past6MonthsADP[5];
const currentMonth2QB = PValues.super.past6MonthsADP[5];
export const Players = new Mongo.Collection('players');

// if (Meteor.isServer) {
//   // This code only runs on the server
//   // Only publish tasks that are public or belong to the current user
//   Meteor.publish('players', function() {
//     console.log('playas');
//     return Players.find({});
//   });
// }

Meteor.methods({
  'players.getPlayers'() {
    return Players.find({}).fetch();
  },
  'players.getSortedStandardPlayers'() {
    const sortQuery = {};
    sortQuery['rankings.0.rank'] = 1;
    return Players.find({}, { sort: sortQuery }).fetch();
  },
  'players.getSorted2QBPlayers'() {
    const sortQuery = {};
    sortQuery['rankings.0.rank_2qb'] = 1;
    return Players.find({}, { sort: sortQuery }).fetch();
  },
  'teams.getStandardTopTrenders'() {
    const query = { 'position': {'$ne': 'PICK' }};
    query[currentMonthStandard] = { $lt: 151 };
    return Players.find(query, { sort: { trend: -1 }, limit: 10 }).fetch();
  },
  'teams.get2QBTopTrenders'() {
    const query = { 'position': {'$ne': 'PICK' }};
    query[currentMonth2QB] = { $lt: 151 };
    return Players.find(query, { sort: { trend: -1 }, limit: 10 }).fetch();
  },
  'teams.getStandardBottomTrenders'() {
    const query = { 'position': {'$ne': 'PICK' }};
    query[currentMonthStandard] = { $lt: 151 };
    return Players.find(query, { sort: { trend: 1 }, limit: 10 }).fetch();
  },
  'teams.get2QBBottomTrenders'() {
    const query = { 'position': {'$ne': 'PICK' }};
    query[currentMonth2QB] = { $lt: 151 };
    return Players.find(query, { sort: { trend: 1 }, limit: 10 }).fetch();
  },
  'teams.getStandardUnderValuedPlayers'() {
    const query = { 'status': {'$ne': 'R' }, 'rankings.0.rank': {'$lt': 150}};
    return Players.find(query, { sort: { 'rankings.0.buyindex': -1 }, limit: 10 }).fetch();
  },
  'teams.get2QBUnderValuedPlayers'() {
    const query = { 'status': {'$ne': 'R' }, 'rankings.0.rank_2qb': {'$lt': 150}};
    return Players.find(query, { sort: { 'rankings.0.buyindex_2qb': -1 }, limit: 10 }).fetch();
  },
  'teams.getStandardOverValuedPlayers'() {
    const query = { 'status': {'$ne': 'R' }, 'rankings.0.rank': {'$lt': 150}};
    return Players.find(query, { sort: { 'rankings.0.buyindex': 1 }, limit: 10 }).fetch();
  },
  'teams.get2QBOverValuedPlayers'() {
    const query = { 'status': {'$ne': 'R' }, 'rankings.0.rank_2qb': {'$lt': 150}};
    return Players.find(query, { sort: { 'rankings.0.buyindex_2qb': -1 }, limit: 10 }).fetch();
  },
  'teams.getStandardWinNowPlayers'() {
    const query = { 'status': {'$ne': 'R' }, 'rankings.0.rank': {'$lt': 150}};
    return Players.find(query, { sort: { 'rankings.0.win_now': -1 }, limit: 10 }).fetch();
  },
  'teams.get2QBWinNowPlayers'() {
    const query = { 'status': {'$ne': 'R' }, 'rankings.0.rank_2qb': {'$lt': 150}};
    return Players.find(query, { sort: { 'rankings.0.win_now_2qb': -1 }, limit: 10 }).fetch();
  },
  'teams.getStandardWinLaterPlayers'() {
    const query = { 'status': {'$ne': 'R' }, 'rankings.0.rank': {'$lt': 150}};
    return Players.find(query, { sort: { 'rankings.0.win_now': 1 }, limit: 10 }).fetch();
  },
  'teams.get2QBWinLaterPlayers'() {
    const query = { 'status': {'$ne': 'R' }, 'rankings.0.rank_2qb': {'$lt': 150}};
    return Players.find(query, { sort: { 'rankings.0.win_now_2qb': -1 }, limit: 10 }).fetch();
  },
  'players.getPlayer'({ playerId }) {
    const id = new Meteor.Collection.ObjectID(playerId);
    return Players.find({ _id: id }).fetch()[0];
  },
  // 'players.getSimilarPlayersStandard'({ playerId }) {
  //   const id = new Meteor.Collection.ObjectID(playerId);
  //   const player = Players.find({ _id: id }).fetch()[0];
  //   console.log(player);
  //   const prevQuery = {};
  //   prevQuery[currentMonthStandard] = { $lt: player[currentMonthStandard] };
  //   const prevSortQuery = {};
  //   prevSortQuery[currentMonthStandard] = 1;
  //   const prev = Players.find(prevQuery, { sort: prevSortQuery, limit: 5 });
  //   console.log(prev);
  // },


});
