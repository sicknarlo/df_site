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
    sortQuery[currentMonthStandard] = 1;
    return Players.find({}, { sort: sortQuery }).fetch();
  },
  'players.getSorted2QBPlayers'() {
    const sortQuery = {};
    sortQuery[currentMonth2QB] = 1;
    return Players.find({}, { sort: sortQuery }).fetch();
  },
  'teams.getStandardTopTrenders'() {
    const query = {};
    query[currentMonthStandard] = { $lt: 151 };
    return Players.find(query, { sort: { trend: -1 }, limit: 25 }).fetch();
  },
  'teams.get2QBTopTrenders'() {
    const query = {};
    query[currentMonth2QB] = { $lt: 151 };
    return Players.find(query, { sort: { trend: -1 }, limit: 25 }).fetch();
  },
  'teams.getStandardBottomTrenders'() {
    const query = {};
    query[currentMonthStandard] = { $lt: 151 };
    return Players.find(query, { sort: { trend: 1 }, limit: 25 }).fetch();
  },
  'teams.get2QBBottomTrenders'() {
    const query = {};
    query[currentMonth2QB] = { $lt: 151 };
    return Players.find(query, { sort: { trend: 1 }, limit: 25 }).fetch();
  },
  'teams.getStandardUnderValuedPlayers'() {
    const query = {};
    return Players.find(query, { sort: { buy_index: -1 }, limit: 25 }).fetch();
  },
  'teams.get2QBUnderValuedPlayers'() {
    const query = {};
    return Players.find(query, { sort: { buy_index_2qb: -1 }, limit: 25 }).fetch();
  },
  'teams.getStandardOverValuedPlayers'() {
    const query = {};
    return Players.find(query, { sort: { buy_index: 1 }, limit: 25 }).fetch();
  },
  'teams.get2QBOverValuedPlayers'() {
    const query = {};
    return Players.find(query, { sort: { buy_index_2qb: 1 }, limit: 25 }).fetch();
  },
  'teams.getStandardWinNowPlayers'() {
    const query = {};
    return Players.find(query, { sort: { win_now_index: -1 }, limit: 25 }).fetch();
  },
  'teams.get2QBWinNowPlayers'() {
    const query = {};
    return Players.find(query, { sort: { win_now_index_2qb: -1 }, limit: 25 }).fetch();
  },
  'teams.getStandardWinLaterPlayers'() {
    const query = {};
    return Players.find(query, { sort: { win_now_index: 1 }, limit: 25 }).fetch();
  },
  'teams.get2QBWinLaterPlayers'() {
    const query = {};
    return Players.find(query, { sort: { win_now_index_2qb: 1 }, limit: 25 }).fetch();
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
