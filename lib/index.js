'use strict';

const Own2Json = require('own2json');


module.exports = { register };


function register (manager, options, callback) {
  const name = options.name;

  manager.defineErrorHandler(name, function reporterErrorPolicy (err) {
    manager.client.report(Own2Json.call(err));
  });

  if (options.use === true) {
    manager.setErrorHandler(name);
  }

  callback();
}
