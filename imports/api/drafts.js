import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Drafts = new Mongo.Collection('drafts');

Meteor.methods({
  'drafts.create'(state) {
    const newState = state;
    newState.date = new Date();
    newState.user = this.userId;

    newState.title = `${newState.date
      .toJSON()
      .slice()
      .slice(
        0,
        10
      )} | ${newState.draftOptions.teamCount} teams | ${newState.draftOptions.roundCount} rounds `;

    return Drafts.insert(newState);
  },

  'drafts.update'(data) {
    const state = data.state;
    const id = data.id;

    Drafts.update({ _id: id }, state);
    return Drafts.find({ _id: id }).fetch();
  },

  'drafts.delete'(draftId) {
    check(draftId, String);

    Drafts.remove({ _id: draftId });
  },

  'drafts.get'(draftMateID) {
    return Drafts.find({ _id: draftMateID }).fetch();
  },

  'drafts.getDrafts'() {
    return Drafts.find({ user: this.userId }, { fields: { title: 1 } }).fetch();
  },
});
