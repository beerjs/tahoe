import Hapi from 'hapi'
import raygun from 'raygun'
import routes from './routes'

const options = {
  ops: {
    interval: 1000
  },
  reporters: {
    console: [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', response: '*' }]
      },
      {
        module: 'good-console'
      },
      'stdout'
    ],
    file: [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ ops: '*' }]
      },
      {
        module: 'good-squeeze',
        name: 'SafeJson'
      },
      {
        module: 'good-file',
        args: ['./log/fixtures/hapi_log']
      }
    ],
    http: [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ error: '*' }]
      },
      {
        module: 'good-http',
        args: [
          'http://prod.logs:3000',
          {
            wreck: {
              headers: { 'x-api-key': 12345 }
            }
          }
        ]
      }
    ]
  }
}

const raygunClient = new raygun.Client().init({ apiKey: '2aqTRCoqwJvVjPYx++ZO8A==' })
const server = new Hapi.Server()

server.connection({ port: process.env.PORT || 8989 })

routes.forEach((route) => {
  server.route(route)
})

server.on('request-error', (req, err) => {
  raygunClient.send(err, {}, () => {
    console.log('Send to Raygun')
    throw err
  }, req)
})

server.register({
  options,
  register: require('good')
}, (err) => {
  if (err) { throw err }

  server.start(() => {
    console.log(`Server started at: ${server.info.uri}`)
  })
})
