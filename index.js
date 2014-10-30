
'use strict';

var restify = require('restify')
  , geo = require('maxmind-db-reader');

//
// Open and read the provided database.
//
var db = geo.openSync('./countries.mmdb' || process.env.DB);

//
// Create a new restify server.
//
var server = restify.createServer({
  name: 'GeoIP2',
  version: '1.0.0'
});

//
// Add middleware.
//
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());

server.get('/:ip', function (req, res, next) {
  var params = req.params || {};

  if (!params.ip) return next(new Error('Please provide an IP'));
  db.getGeoData(params.ip, function get(error, data) {
    if (error) return next(error);

    res.json(data);
    return next();
  });
});

//
// Start listening.
//
server.listen(process.env.PORT || 8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});