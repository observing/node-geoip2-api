'use strict';

var chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.config.includeStack = true;

//
// Expose GeoIP2 API server.
//
exports.API = require('../');
exports.server = require('../server');

//
// Expose our assertations.
//
exports.expect = chai.expect;
exports.sinon = sinon;

//
// Expose a port number generator.
//
var port = 1024;
Object.defineProperty(exports, 'port', {
  get: function get() {
    return port++;
  }
});