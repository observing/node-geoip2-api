'use strict';

var debug = require('diagnostics')('geoip2');

/**
 * Setup get route.
 *
 * @param {GeoIp2API} Instantiated API.
 * @returns {GeoIp2API} Fluent interface.
 * @api public
 */
module.exports = function initRoutes(api) {
  api.server.get('/:ip', function (req, res, next) {
    var params = req.params || {}
      , ip = params.ip;

    if (!ip) {
      debug('Missing required parameter IP for route /:ip');
      return next(new Error('Please provide an IP'));
    }

    api.get(ip, function found(error, data) {
      if (error) {
        debug('Failed serving geographical data for IP %s', ip);
        return next(error);
      }

      res.json(data);
      next();
    });
  });

  return api;
};