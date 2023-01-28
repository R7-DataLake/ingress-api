import fastify from 'fastify'
import path from 'path';

const autoload = require('@fastify/autoload')

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

app.addHook('onSend', (request: any, reply: any, playload: any, next: any) => {
  reply.headers({
    'X-Powered-By': 'R7 Health Platform System',
    'X-Processed-By': process.env.R7PLATFORM_INGR_R7_SERVICE_HOSTNAME || 'dummy-server',
  });
  next();
});

// app.addHook('preHandler', (request, reply, done) => {
//   console.log(request.user)
//   done()
// })

// JWT
app.register(require('./plugins/jwt'), {
  secret: process.env.R7PLATFORM_INGR_SECRET_KEY || 'UR6oFDD7mrOcpHruz2U71Xl4FRi1CDGu',
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

// Queue
const queueName = process.env.R7PLATFORM_INGR_QUEUE_NAME || 'R7QUEUE'

app.register(require('./plugins/bullmq'), {
  queue_name: queueName,
  options: {
    connection: {
      host: process.env.R7PLATFORM_INGR_REDIS_HOST || 'localhost',
      port: Number(process.env.R7PLATFORM_INGR_REDIS_PORT) || 6379,
      password: process.env.R7PLATFORM_INGR_REDIS_PASS || '',
      enableOfflineQueue: false,
    },
    defaultJobOptions: {
      delay: 1000,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: {
        age: 3600, // keep up to 1 hour
        count: 10000, // keep up to 10000 jobs
      },
      removeOnFail: {
        age: 2 * 24 * 3600, // keep up to 48 hours
      },
    }
  }
})

// routes
app.register(autoload, {
  dir: path.join(__dirname, 'routes')
})

export default app;
