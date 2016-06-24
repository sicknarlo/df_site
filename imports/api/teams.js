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
    initialAdd.add = team.players;
    initialAdd.remove = [];
    initialAdd.type = 'initial';
    initialAdd.date = new Date();
    initialAdd.valueMonth = team.valueMonth;

    let initialValue = 0;

    for (var i=0; i< team.players.length; i++) {
      initialValue += team.players[i][team.valueMonth];
      console.log(initialValue);
    }

    const initVal = {
      value: initialValue,
      date: new Date(),
    }

    Teams.insert({
      name: team.teamName,
      teamCount: team.teamCount,
      isPPR: team.isPPR,
      is2QB: team.is2QB,
      isIDP: team.isIDP,
      owner: this.userId,
      players: team.players,
      transactions: [initialAdd],
      values: [initVal],
      username: Meteor.users.findOne(this.userId).username,
    });
  },

  'teams.delete'(teamId) {
    check(teamId, String);

    Teams.remove(teamId);
  },

  'teams.get'() {
    Teams.find({ userId: this.userId });
  },
});
