import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/routes.jsx';

import '../imports/startup/accounts-config.js';
// import App from '../imports/ui/App.jsx';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app'));
});
