import fastify from 'fastify'
import path, { join } from 'path';
const autoload = require('@fastify/autoload')

require('dotenv').config({ path: join(__dirname, '../config.conf') })

const app = fastify({
  logger: {
    transport:
      process.env.NODE_ENV === 'development'
        ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
            colorize: true
          }
        }
        : undefined
  }
})

// Plugins
app.register(require('@fastify/formbody'))
app.register(require('@fastify/cors'))

// Rate limit
app.register(import('@fastify/rate-limit'), {
  global: false,
  max: 100,
  timeWindow: '1 minute'
})

// Database
app.register(require('./plugins/db'), {
  options: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      port: Number(process.env.DB_PORT) || 5432,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
    },
    searchPath: ['public'],
    pool: {
      min: 0,
      max: 100
    },
    debug: process.env.DB_DEBUG === "Y" ? true : false,
    // userParams: {
    //   userParam1: '451'
    // }
  }
})

// JWT
app.register(require('./plugins/jwt'), {
  secret: process.env.SECRET_KEY || '@1234567890@',
  sign: {
    iss: 'r7.moph.go.th',
    expiresIn: '1d'
  },
  messages: {
    badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
    noAuthorizationInHeaderMessage: 'Autorization header is missing!',
    authorizationTokenExpiredMessage: 'Authorization token expired',
    authorizationTokenInvalid: (err: any) => {
      return `Authorization token is invalid: ${err.message}`
    }
  }
})

// Axios
app.register(require('fastify-axios'), {
  clients: {
    httpbin: {
      baseURL: 'https://httpbin.org',
      headers: {
        'Authorization': 'Bearer ' + process.env.API_TOKEN
      }
    },
    randomuser: {
      baseURL: 'https://randomuser.me/api'
    }
  }
})

// routes
app.register(autoload, {
  dir: path.join(__dirname, 'routes')
})
// app.register(require("./routes/health_check"), { prefix: '/health-check' })
// app.register(require("./routes/welcome"), { prefix: '/' })
// app.register(require("./routes/services"), { prefix: '/services' })
// app.register(require("./routes/resources"), { prefix: '/resources' })
// app.register(require("./routes/schema"), { prefix: '/schema' })

export default app;
