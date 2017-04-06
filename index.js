process.chdir(__dirname);
const sails = require('sails');
const rc = require('rc');
sails.lift(rc('sails'));
