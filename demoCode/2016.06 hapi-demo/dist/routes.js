'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [{
  method: 'GET',
  path: '/test',
  // path: '/test/{testId?}', // ? optional http://localhost:8888/test/asddas
  // path: '/test/{testId}/{img}.jpg', // file type specific
  // path: '/test/{testId}/files', // http://localhost:8888/test/asddas/files
  // path: '/test/{testId*}', // http://localhost:8888/test/asddas/files/sdfas/sdfs/sfsreer/gdfsd
  // path: '/test/{testId*2}', // http://localhost:8888/test/asddas/vadf
  handler: function handler(request, reply) {
    // error, result
    reply(null, 'success get').code(201);
    // reply(null, fs.createReadStream(__filename))
  }
}, {
  method: ['POST', 'PUT'],
  path: '/test',
  config: {
    payload: {
      output: 'data',
      parse: true,
      allow: 'application/json'
    }
  },
  handler: function handler(request, reply) {
    reply(null, request.payload).code(222);
  }
}, {
  method: 'GET',
  path: '/error',
  handler: function handler(request, reply) {
    reply(213);
  }
}, {
  method: ['POST', 'PUT'],
  path: '/upload',
  config: {
    payload: {
      output: 'stream',
      parse: false,
      allow: ['application/json'],
      maxBytes: 5000000
    }
  },
  handler: function handler(request, reply) {
    reply(null, request.payload);
  }
}]; // import fs from 'fs'
// import path from 'path'