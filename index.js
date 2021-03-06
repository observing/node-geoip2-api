'use strict';

var path = require('path')
  , restify = require('restify')
  , geo = require('maxmind-db-reader')
  , debug = require('diagnostics')('geoip2-api');

/**
 * GeoIp2API constructor.
 *
 * @param {Server} server HTTP server instance.
 * @param {Object} options Configuration.
 * @Constructor
 * @api public
 */
var GeoIp2API = module.exports = function GeoIp2API(server, options) {
  if (!(this instanceof GeoIp2API)) return new GeoIp2API(options);
  this.options = options || {};


  //
  // Open and read the provided database.
  //
  this.db = geo.openSync(
    this.options.db || process.env.DB || path.join(__dirname, 'db.mmdb')
  );

  //
  // Attach the server to the instance.
  //
  this.server = server;
};

/**
 * Attach set of routes to the server
 *
 * @param {Array} routes Collection of functions.
 * @api public
 */
GeoIp2API.prototype.routing = function routing(routes) {
  var api = this;

  routes.forEach(function addRoutes(router) {
    router(api);
  });
};

/**
 * Get data by IP.
 *
 * @param {String} ip IP to query.
 * @param {Function} done Completion callback.
 * @returns {GeoIp2API}
 * @api public
 */
GeoIp2API.prototype.get = function get(ip, done) {
  this.db.getGeoData(ip, function fetched(error, data) {
    if (error) return done(error);

    debug('Found geographical data for ip %s', ip);
    return done(null, data);
  });

  return this;
};

/**
 * Create a new restify powered GeoIp2API server.
 *
 * @param {Number} port Port to listen on.
 * @param {Object} options Configuration.
 * @returns {GeoIp2API}
 * @api public
 */
GeoIp2API.createServer = function createServer(port, options) {
  var api;

  options = 'object' === typeof port ? port : options || {};
  if ('number' === typeof port) options.port = port;

  options.name = options.name || 'GeoIP2';
  options.version = options.version || require('./package').version;
  options.port = options.port || process.env.PORT || 8082;

  //
  // Create a Restify server and add default Restify middleware.
  //
  api = new GeoIp2API(restify.createServer(options), options);
  api.server.use(restify.acceptParser(api.server.acceptable));
  api.server.use(restify.queryParser());

  //
  // Initialize the server with the provided routes.
  //
  api.routing(options.routes || [require('./server')]);

  //
  // Listen by defauly unless specifically forbidden through options.
  //
  if (options.listen !== false) {
    api.server.listen(options.port, function listening(error) {
      if (error) return console.error(error);
      debug('%s listening at %s', api.server.name, api.server.url);
    });
  }

  return api;
};