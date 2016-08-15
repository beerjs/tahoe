'use strict';

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _raygun = require('raygun');

var _raygun2 = _interopRequireDefault(_raygun);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = {
  ops: {
    interval: 1000
  },
  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ log: '*', response: '*' }]
    }, {
      module: 'good-console'
    }, 'stdout'],
    file: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ ops: '*' }]
    }, {
      module: 'good-squeeze',
      name: 'SafeJson'
    }, {
      module: 'good-file',
      args: ['./log/fixtures/hapi_log']
    }],
    http: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ error: '*' }]
    }, {
      module: 'good-http',
      args: ['http://prod.logs:3000', {
        wreck: {
          headers: { 'x-api-key': 12345 }
        }
      }]
    }]
  }
};

var raygunClient = new _raygun2.default.Client().init({ apiKey: '2aqTRCoqwJvVjPYx++ZO8A==' });
var server = new _hapi2.default.Server();

server.connection({ port: process.env.PORT || 8989 });

_routes2.default.forEach(function (route) {
  server.route(route);
});

server.on('request-error', function (req, err) {
  raygunClient.send(err, {}, function () {
    console.log('Send to Raygun');
    throw err;
  }, req);
});

server.register({
  options: options,
  register: require('good')
}, function (err) {
  if (err) {
    throw err;
  }

  server.start(function () {
    console.log('Server started at: ' + server.info.uri);
  });
});