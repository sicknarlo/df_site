import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import rp from 'request-promise';
import tough from 'tough-cookie';
import xml2js from 'xml2js';

import { Players } from './players.js';

Meteor.methods({
  'adp.uploadAdpToMFL'(opt) {
    const sortQuery = {};
    sortQuery['rankings.0.rank'] = 1;
    const playerString = opt.players;
    const loginUri = `https://api.myfantasyleague.com/2017/login?L=${opt.franchise}&USERNAME=${opt.username}&PASSWORD=${opt.password}&XML=1`;

    const options = {};
    options.uri = loginUri;
    return rp(options)
      .then(x => {
        const args = {};
        return xml2js.parseString(x, (err, result) => {
          if (err) return err;
          args.uri = `http://www98.myfantasyleague.com/2017/import?L=${opt.franchise}&TYPE=myDraftList&PLAYERS=${playerString}`;
          args.headers = {
            'Cookie': `MFL_USER_ID=${result.status['$']['MFL_USER_ID']}`,
          }
          return rp(args)
              .then(function (body) {
                  // Request succeeded...
                  response = body;
              })
              .catch(function (err) {
                  return err;
              });
        });
    })
    .catch(err => { return err });
  },

});
