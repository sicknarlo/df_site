import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Drafts = new Mongo.Collection('drafts');

Meteor.methods({
  'drafts.create'(draft) {
    if (!this.userId) {
      throw new Meteor.error('not-authorized');
    }
    const newDraft = draft;
    newDraft.user = this.userId;
    newDraft.date = new Date();
    return Drafts.insert(newDraft);
  },

  'drafts.delete'(draftId) {
    check(draftId, String);

    Drafts.remove(draftId);
  },

  'drafts.get'() {
    Drafts.find({ userId: this.userId });
  },
});
