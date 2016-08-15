import fs from 'fs'
import path from 'path'
import Boom from 'boom'

export default [
  {
    method: 'GET',
    // path: '/test',
    // path: '/test/{testId?}', // ? optional http://localhost:8888/test/asddas
    // path: '/test/{testId}/{img}.jpg', // file type specific
    // path: '/test/{testId}/files', // http://localhost:8888/test/asddas/files
    path: '/test/{testId*}', // http://localhost:8888/test/asddas/files/sdfas/sdfs/sfsreer/gdfsd
    // path: '/test/{testId*2}', // http://localhost:8888/test/asddas/vadf
    handler (request, reply) {
      console.log('PATH', request.path)
      console.log('METHOD', request.method)
      console.log('PARAMS', request.params)

      reply(null, 'success get').code(420)
      // reply(null, { body: 'Body content' }).code(201)
      // reply(null, fs.createReadStream('./src/beerjs.png'))
    }
  },
  {
    method: 'GET',
    path: '/config',
    config: {
      description: 'Say hello!',
      notes: 'The user parameter defaults to \'stranger\' if unspecified',
      tags: ['api', 'greeting']
    },
    handler (request, reply) {
      reply(null, 'config example')
    }
  },
  {
    method: ['POST'],
    path: '/test',
    config: {
      payload: {
        output: 'data',
        parse: true,
        allow: 'application/json'
      }
    },
    handler (request, reply) {
      reply(null, request.payload).code(222)
    }
  },
  {
    method: 'GET',
    path: '/error',
    handler (request, reply) {
      reply(Boom.badRequest('Unsupported parameter'))
    }
  },
  {
    method: ['POST', 'PUT'],
    path: '/upload',
    config: {
      payload: {
        output: 'stream',
        parse: false,
        allow: ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'],
        maxBytes: 50000000
      }
    },
    handler (request, reply) {
      const data = request.payload
      const contentType = request.payload.headers['content-type']

      let fileExt = 'txt'

      if (contentType.indexOf('jpg') !== -1) {
        fileExt = 'jpg'
      } else if (contentType.indexOf('jpeg') !== -1) {
        fileExt = 'jpeg'
      } else if (contentType.indexOf('png') !== -1) {
        fileExt = 'png'
      } else if (contentType.indexOf('gif') !== -1) {
        fileExt = 'gif'
      }

      const filePath = path.join(__dirname, `tmp/${Math.floor(Math.random() * 500)}.${fileExt}`)
      const writable = fs.createWriteStream(filePath)

      data.pipe(writable)

      data.on('end', (err) => {
        if (err) {
          reply(JSON.stringify(err))
        }

        writable.end()
      })

      writable.on('error', (err) => {
        reply(JSON.stringify(err))
          .code(502)
      })

      writable.on('finish', (err) => {
        if (err) {
          reply(JSON.stringify(err))
            .code(502)
        } else {
          reply({
            body: 'File Uploaded'
          }).code(201)
        }
      })
    }
  }
]
