var fs = require('fs');
var path = require('path');
var glob = require('glob');
var scp2 = require('scp2');
var merge = require('lodash.merge');
var isArray = require('lodash.isarray');
var Promise = require('bluebird');

module.exports = function (opts) {

  var options = merge({
    port: 22,
    files: '**/*',
    localRoot: process.cwd(),
    remoteRoot: '/',
  }, opts);

  var client;

  function startConnection () {
    return new Promise(function (resolve, reject) {
      client = new scp2.Client({
        host: options.host,
        port: options.port,
        username: options.username,
        password: options.password,
        privateKey: options.privateKey ? fs.readFileSync(options.privateKey) : undefined
      });
      resolve(client);
    });
  }

  function getFiles () {
    return new Promise(function (resolve, reject) {
      if (isArray(options.files)) {
        resolve(options.files);
      } else {
        glob(options.files, {
          cwd: options.localRoot,
          ignore: options.exclude,
          dot: true
        }, function (err, files) {
          if (err) {
            reject(err);
          } else {
            resolve(files);
          }
        });
      }
    });
  }

  function getDirectoriesForCreation () {
    return getFiles().then(function (files) {
      return new Promise(function (resolve) {
        resolve(files.filter(function (file) {
          var localPath = path.resolve(process.cwd(), options.localRoot, file);
          var stats = fs.statSync(localPath);
          return stats && stats.isDirectory();
        }));
      });
    });
  }

  function createRemoteDirectories (directories) {
    return Promise.each(directories, function (directory) {
      return new Promise(function (resolve, reject) {
        var remotePath = path.resolve(options.remoteRoot, directory);
        client.mkdir(remotePath, function (err) {
          if(err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  function getFilesForUpload () {
    return getFiles().then(function (files) {
      return new Promise(function (resolve) {
        resolve(files.filter(function (file) {
          var localPath = path.resolve(process.cwd(), options.localRoot, file);
          var stats = fs.statSync(localPath);
          return stats && !stats.isDirectory();
        }));
      });
    });
  }

  function uploadFiles (files) {
    return Promise.each(files, function (file) {
      return new Promise(function (resolve, reject) {
        var localPath = path.resolve(process.cwd(), options.localRoot, file);
        var remotePath = path.resolve(options.remoteRoot, file);
        client.upload(localPath, remotePath, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(remotePath);
          }
        });
      });
    });
  }

  function quitConnection () {
    return new Promise(function (resolve) {
      client.close();
      resolve();
    });
  }

  return startConnection().then(getDirectoriesForCreation).then(createRemoteDirectories).then(getFilesForUpload).then(uploadFiles).then(quitConnection);

};
