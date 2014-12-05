/*global beforeEach, afterEach*/
'use strict';

var common = require('./common')
  , http = require('http')
  , expect = common.expect
  , sinon = common.sinon
  , API = common.API
  , api, server;

describe('Server', function() {
  beforeEach(function (done) {
    api = API.createServer(common.port);
    done();
  });

  afterEach(function(done) {
    api = null;
    done();
  });

  it('exposes a function', function () {
    expect(common.server).to.be.a('function');
  });

  it('returns a reference to the api', function () {
    expect(common.server(api)).to.equal(api);
  });

  it('registers routes with Restify', function () {
    expect(api.server.router.routes.GET).to.be.an('array');
    expect(api.server.router.routes.GET).to.have.length(1);
    expect(api.server.router.routes.GET[0].spec.path).to.equal('/:ip');
  });
});