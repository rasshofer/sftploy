#!/usr/bin/env node

var path = require('path');
var nconf = require('nconf');
var sftploy = require('./sftploy');
var leprechaun = require('leprechaun');
var inquirer = require('inquirer');
var merge = require('lodash.merge');
var snakeCase = require('lodash.snakecase');
var Promise = require('bluebird');

var options = {};

nconf.argv().env({
  match: /^sftploy/i
}).file({
  file: path.resolve(process.cwd(), 'sftploy.json')
});

[
  'username',
  'password',
  'privateKey',
  'host',
  'port',
  'files',
  'localRoot',
  'remoteRoot',
  'exclude'
].forEach(function (key) {
  var env = snakeCase(key);
  options[key] = nconf.get(key) || nconf.get('sftploy_' + env.toLowerCase()) || nconf.get('SFTPLOY_' + env.toUpperCase());
});

function ensurePassword (opts) {
  return new Promise(function (resolve) {
    if (opts.password || opts.privateKey) {
      resolve(opts);
    } else {
      inquirer.prompt([{
        type: 'password',
        message: 'Enter your password',
        name: 'password',
        validate: function (value) {
          return !!value || 'Please enter a password.';
        }
      }]).then(function (answers) {
        resolve(merge(opts, answers));
      });
    }
  });
}

function deploy (opts) {
  sftploy(opts).then(function () {
    leprechaun.success('SFTPloyment successful.');
  }).catch(function (error) {
    leprechaun.error('SFTPloyment failed.');
    console.error(error);
    process.exit(1);
  });
}

ensurePassword(options).then(deploy);
