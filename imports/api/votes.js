import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Votes = new Mongo.Collection('votes');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('votes', function tasksPublication() {
    return Votes.find({});
  });
}

Meteor.methods({
  'votes.getPlayer'({ playerId }) {
    const result = Votes.find({ playerId }).fetch();
    return result;
  },
  'votes.addVote'({ playerId, moveType }) {
    const currentVote = Votes.findOne({ userId: this.userId, playerId });
    if (currentVote) {
      Votes.remove({ playerId, userId: this.userId });
    }
    Votes.insert({
      userId: this.userId,
      playerId,
      moveType,
      createdAt: new Date(),
    });
  },
});
