'use strict';

/**
 * Initialize default routes.
 *
 * @param {GeoIp2API} Instantiated API.
 * @returns {GeoIp2API} Fluent interface.
 * @api public
 */
module.exports = function initRoutes(api) {
  api.server.get('/:ip', function (req, res, next) {
    var params = req.params || {};

    if (!params.ip) return next(new Error('Please provide an IP'));
    api.db.getGeoData(params.ip, function get(error, data) {
      if (error) return next(error);

      res.json(data);
      return next();
    });
  });

  return api;
};