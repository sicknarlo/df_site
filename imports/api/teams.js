import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Teams = new Mongo.Collection('teams');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('teams', function tasksPublication() {
    return Teams.find({
      $or: [
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'teams.create'(team) {
    if (! this.userId) {
      throw new Meteor.error('not-authorized');
    }
    console.log(team);
    const initialAdd = {};
    initialAdd.add = team.players.map((p) => p._id._str);
    initialAdd.remove = [];
    initialAdd.type = 'initial',

    Teams.insert({
      teamName: team.teamName,
      teamCount: team.teamCount,
      isPPR: team.isPPR,
      is2QB: team.is2QB,
      isIDP: team.isIDP,
      owner: this.userId,
      players: team.players,
      transactions: [initialAdd],
      username: Meteor.users.findOne(this.userId).username,
    });
  },

  'teams.delete'(teamId) {
    check(teamId, String);

    Teams.remove(teamId);
  },

  'teams.get'() {
    Teams.find({ userId: this.userId });
  }
});
