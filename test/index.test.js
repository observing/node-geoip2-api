/*global beforeEach, afterEach*/
'use strict';

var common = require('./common')
  , exec = require('child_process').exec
  , http = require('http')
  , Restify = require('restify')
  , expect = common.expect
  , sinon = common.sinon
  , API = common.API
  , api, server;

describe('API', function() {
  before(function (done) {
    this.timeout(2E5);
    console.log('    Fetching MaxMind\'s GeoLite2 database...');
    var child = exec('./bin/setup', function (error, stdout, stderr) {
      if (error) return done(error);

      console.log('    Finished downloading database to db.mmdb');
      done();
    });
  });

  beforeEach(function (done) {
    server = http.createServer(function () {
      throw new Error('Unhandled request');
    });

    api = new API(server);

    server.portnumber = common.port;
    server.listen(server.portnumber, done);
  });

  afterEach(function(done) {
    server.close(function () {
      api = null;
      done();
    });
  });

  it('is a constructor', function() {
    expect(API).to.be.a('function');
    expect(api).to.be.instanceof(API);
    expect(api).to.be.an('object');
  });

  it('has configurable options', function () {
    var local = new API(server, {
      port: 8081,
      protocol: 'https'
    });

    expect(api.options).to.be.an('object');
    expect(Object.keys(api.options).length).to.equal(0);
    expect(local.options).to.have.property('port', 8081);
    expect(local.options).to.have.property('protocol', 'https');
  });

  it('has reference to the GeoIP2 database', function () {
    expect(api.db).to.be.an('object');
    expect(api.db.getGeoData).to.be.a('function');
  });

  it('has reference to an optional server instance', function () {
    expect(api).to.have.property('server');

    var local = new API;
    expect(local).to.not.have.property('server', undefined);
  });

  describe('#routing', function () {
    it('is a function', function() {
      expect(api.routing).to.be.a('function');
    });

    it('will register the provided routes', function (done) {
      function exposer(apiRef) {
        apiRef.test = function (data) {
          expect(data).to.equal('testing the route');
          done();
        };
      }

      api.routing([ exposer ]);
      expect(api).to.have.property('test');
      api.test('testing the route');
    });
  });

  describe('#get', function () {
    it('is a function', function() {
      expect(api.get).to.be.a('function');
    });

    it('returns a reference to the api', function () {
      expect(api.get('127.0.0.1', function () {})).to.equal(api);
    });

    it('will return an error on failure', function () {
      function throwsIP() {
        api.get('test', function () { });
      }

      expect(throwsIP).to.throw('Invalid IPv6 address');
    });

    it('queries the database by IP', function (done) {
      var spy = sinon.spy(api.db, 'getGeoData');

      api.get('127.0.0.1', function () {
        expect(spy.callCount).to.equal(1);
        expect(spy.args[0][0]).to.equal('127.0.0.1');
        spy.restore();
        done();
      });
    });
  });

  describe('#createServer', function () {
    it('is a function', function() {
      expect(API.createServer).to.be.a('function');
    });

    it('returns an api with a provisioned Restify server', function () {
      var local = API.createServer({ listen: false });

      expect(local).to.have.property('options');
      expect(local).to.have.property('server');
    });

    it('sets configurable options on Restify server', function () {
      var local = API.createServer({
        listen: false,
        name: 'testServer',
        version: '0.0.1',
        port: 8080
      });

      expect(local.options).to.have.property('port', 8080);
      expect(local.options).to.have.property('name', 'testServer');
      expect(local.options).to.have.property('version', '0.0.1');
      expect(local.server).to.have.property('name', 'testServer');
      expect(local.server).to.have.property('versions', '0.0.1');
    });

    it('can be provided with a port which overwrites options.port', function () {
      var local = API.createServer(8082, { listen: false, port: 8080 });

      expect(local.options).to.have.property('port', 8082);
    });
  });
});