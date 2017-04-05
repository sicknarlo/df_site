import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Drafts = new Mongo.Collection('drafts');

Meteor.methods({
  'drafts.create'(state) {
    if (!this.userId) {
      throw new Meteor.error('not-authorized');
    }
    const newState = state;
    newState.date = new Date();
    newState.user = this.userId;

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

    Drafts.remove(draftId);
  },

  'drafts.get'(draftMateID) {
    return Drafts.find({ _id: draftMateID }).fetch();
  },
});
