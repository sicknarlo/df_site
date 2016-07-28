import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Players2QB = new Mongo.Collection('players2qb');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('players2qb', function tasksPublication() {
    return Players2QB.find({});
  });
}