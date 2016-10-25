# SFTPloy

> A simple (CLI) tool to deploy stuff via SFTP

[![Build Status](https://travis-ci.org/rasshofer/sftploy.svg)](https://travis-ci.org/rasshofer/sftploy)
[![Dependency Status](https://david-dm.org/rasshofer/sftploy/status.svg)](https://david-dm.org/rasshofer/sftploy)
[![Dependency Status](https://david-dm.org/rasshofer/sftploy/dev-status.svg)](https://david-dm.org/rasshofer/sftploy)

(Check out [ftploy](https://www.npmjs.com/package/ftploy) for FTP deployments.)

## Usage

```shell
npm install --save-dev sftploy
```

```js
var sftploy = require('sftploy');

sftploy({
  username: 'john',
  password: 'abc123',
  privateKey: './id_rsa'
  host: 'example.com',
  port: 22,
  localRoot: './build',
  remoteRoot: '/www/example.com/'
  exclude: [
    '.git'
  ]
}).then(function () {
  console.log('Deployment successful.');
}).catch(function (error) {
  console.error('Deployment failed.', error);
});
```

## CLI

```shell
npm install -g sftploy
```

```shell
$ sftploy
```

The following options may be stored within a `sftploy.json` file in the root of your project or passed as parameters or environment variables (prefixed using `sftploy_`). For example, your username and password may be provided in the following three ways.

### `sftploy.json` file

```json
{
  "username": "john",
  "password": "abc123"
}
```

### Parameters

```shell
$ sftploy --username="john" --password="abc123"
```

### Environment variables

```shell
$ SFTPLOY_USERNAME="john" SFTPLOY_PASSWORD="abc123" sftploy
```

## Options

### `username`

The SFTP username.

### `password`

The SFTP password. In case no password is provided, the CLI will prompt you for it.

### `privateKey`

The SSH private key.

### `host`

The SFTP host.

### `port`

The SFTP port.

Default: `22`

### `files`

An array of files or a glob pattern to select files to upload.

Default: `**/*` (= glob pattern for all files and directories within the provided `localRoot`; see below)

### `localRoot`

The local directory whose contents SFTPloy will upload.

Default: `process.cwd()` (= the directory you’re running the CLI in)

### `remoteRoot`

The remote directory where SFTPloy will upload the contents to.

Default: `/`

### `exclude`

Certain files (matching the respective glob patterns) that shall be ignored by SFTPloy. In most cases, you may want to exclude your `.git` directory or directories like `node_modules`.

If you’re using an array of files instead of an glob pattern within the `files` option, `exclude` will be ignored.

#### Examples

```shell
$ sftploy --exclude=*.jpg --exclude=*.png --exclude=node_modules/**/*
```

```json
{
  "exclude": [
    "*.jpg",
    "*.png"
  ]
}
```

## Changelog

* 0.0.1
  * Initial version

## License

Copyright (c) 2016 [Thomas Rasshofer](http://thomasrasshofer.com/)  
Licensed under the MIT license.

See LICENSE for more info.
