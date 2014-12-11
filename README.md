# node-geoip2-api

[![Version npm][version]](http://browsenpm.org/package/node-geoip2-api)[![Build Status][build]](https://travis-ci.org/observing/node-geoip2-api)[![Dependencies][david]](https://david-dm.org/observing/node-geoip2-api)[![Coverage Status][cover]](https://coveralls.io/r/observing/node-geoip2-api?branch=master)

[version]: http://img.shields.io/npm/v/node-geoip2-api.svg?style=flat-square
[build]: http://img.shields.io/travis/observing/node-geoip2-api/master.svg?style=flat-square
[david]: https://img.shields.io/david/observing/node-geoip2-api.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/observing/node-geoip2-api/master.svg?style=flat-square

Node.js API for MaxMind GeoIP2 databases. Best used with the [node-geoip2-client].

[node-geoip2-client]: https://github.com/observing/node-geoip2-client

## Installation

```sh
npm install node-geoip2-api --save
```

If you'd like to download the latest city database, simply run

```sh
npm run setup
```

### Server

The easiest method to run a server instance is by using the CLI tool,
providing a port is optional.

```bash
PORT=8082 npm run server
```

To create and expose a Restify server instance, do the following.
*Note: the server instance will automatically listen to the provided
port, unless told otherwise.*

```js
var server = require('node-geoip2-api').createServer(8082, {
  listen: false
});
```

### Standalone instance

Create a standalone GeoIP2 API instance by directly calling the constructor.
*Note: this will not start a server on a port but exposes the prototype methods.*

```js
var API = require('node-geoip2-api')
  , api = new API(null, {
      db: '/path/to/database'         // defaults to __dirname/db.mmdb
    });
```

### API

The server has several methods available to query the MaxMind GeoIP2 database.

#### client.get

Query the database by IP. The api will directly query the
database on the filesystem and return the results.

- **ip**: _{String}_ required query database by IP.
- **callback**: _{Function}_ required Completion callback.

```js
api.get('172.213.123.21', function (error, result) {
  console.log(result);                // results parsed as JSON
});
```

### License

Node-geoip2-api is released under MIT.