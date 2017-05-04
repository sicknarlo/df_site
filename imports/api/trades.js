import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Trades = new Mongo.Collection('trades');

Meteor.methods({
  'trades.create'(data) {
    check(data, Object);
    const newData = data;
    newData.date = new Date();
    return Trades.insert(newData);
  },

  'trades.getAll'() {
    return Trades.find({}).fetch();
  },

  'trades.get'(filters) {
    const players = filters.players;
    const threshhold = filters.threshhold;
    const query = {};
    query.$and = [];
    if (filters.useThreshold) query.$and.push({ fairness: { $gte: parseInt(threshhold) } });
    players.forEach(player => query.$and.push(
      {
        $or: [
          { team1: player._id._str },
          { team2: player._id._str },
        ],
      }
    ));
    const result = Trades.find(query, { sort: { date: -1 }, limit: 100 }).fetch();
    return result;
  },
});
