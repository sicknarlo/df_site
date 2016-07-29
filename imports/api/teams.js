import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import PValues from '../ui/ADPConst.jsx';

export const Teams = new Mongo.Collection('teams');
import { Players } from './players.js';

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
    const initialAdd = {};
    initialAdd.add = team.players;
    initialAdd.remove = [];
    initialAdd.type = 'initial';
    initialAdd.date = new Date();
    initialAdd.valueMonth = team.valueMonth;

    Teams.insert({
      name: team.teamName,
      teamCount: team.teamCount,
      isPPR: team.isPPR,
      is2QB: team.is2QB,
      isIDP: team.isIDP,
      owner: this.userId,
      players: team.players,
      transactions: [initialAdd],
      values: [],
      username: Meteor.users.findOne(this.userId).username,
    });
  },

  'teams.delete'(teamId) {
    check(teamId, String);

    Teams.remove(teamId);
  },

  'teams.addTransaction'(data) {
    const addRoster = data.team.players.concat(data.nextTrans[data.nextTrans.length - 1].add);
    const newPlayers = addRoster.filter(function(p) {
      let keep = true;
      for (var i=0; i< data.nextTrans[data.nextTrans.length - 1].remove.length; i++) {
        if (p === data.nextTrans[data.nextTrans.length - 1].remove[i]) {
          keep = false;
        }
      }
      return keep;
    })

    Teams.update({_id : data.team._id}, { $set : {
      transactions : data.nextTrans,
      players: newPlayers,
    } });
  },

  'teams.updateValues'() {
    const teams = Teams.find({}).fetch();
    const players = Players.find({}).fetch();
    teams.forEach(function(t) {
      const teamList = players.filter((p) => t.players.indexOf(p._id._str) > -1);
      let value = 0;
      const currentMonthValue = t.is2QB ? PValues.super.past6MonthsValue[5] : PValues.ppr.past6MonthsValue[5]
      teamList.forEach(function(p) {
        value += p[currentMonthValue];
      });
      const oldValues = t.values;
      const newValues = oldValues.concat([[new Date(), value]]);
      Teams.update({_id : t._id}, { $set : {
        values: newValues,
      } });
    })
    console.log('complete');
  },

  'teams.get'() {
    Teams.find({ userId: this.userId });
  },
});
