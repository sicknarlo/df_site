import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const draftMateRankings = new Mongo.Collection('draftMateRankings');
const draftMateRookieRankings = new Mongo.Collection('draftMateRookieRankings');

Meteor.methods({
  'draftMateRankings.getStandardRankings'() {
    return draftMateRankings.find({}, { limit: 1, sort: { $natural: -1 } }).fetch();
  },
  'draftMateRankings.get2QBRankings'() {
    return draftMateRankings.find({}, { limit: 1, sort: { $natural: -1 } }).fetch();
  },
  'draftMateRankings.getRookieRankings'() {
    return draftMateRookieRankings.find({}, { limit: 1, sort: { $natural: -1 } }).fetch();
  },
});
