import { Queue } from 'bullmq'
import fastify from 'fastify'

const app = fastify({
  bodyLimit: 2 * 1024 * 1024, // 2mb
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
  max: 50,
  timeWindow: '1 minute'
})

app.addHook('onSend', (_request: any, reply: any, _playload: any, done: any) => {
  reply.headers({
    'X-Powered-By': 'R7 Health Platform System',
    'X-Processed-By': process.env.R7PLATFORM_INGR_SERVICE_HOSTNAME || 'dummy-server',
  })

  done()

})

// JWT
app.register(require('./plugins/jwt'), {
  secret: process.env.R7PLATFORM_INGR_SECRET_KEY || 'UR6oFDD7mrOcpHruz2U71Xl4FRi1CDGu',
  sign: {
    iss: 'r7.moph.go.th',
    expiresIn: '1h'
  },
  messages: {
    badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
    noAuthorizationInHeaderMessage: 'Autorization header is missing!',
    authorizationTokenExpiredMessage: 'Authorization token expired',
    authorizationTokenInvalid: (error: any) => {
      return `Authorization token is invalid: ${error.message}`
    }
  }
})

// Queue
app.decorate("createIngressQueue", (zoneName: any) => {
  const queue = new Queue(zoneName, {
    connection: {
      host: process.env.R7PLATFORM_INGR_REDIS_HOST || 'localhost',
      port: Number(process.env.R7PLATFORM_INGR_REDIS_PORT) || 6379,
      password: process.env.R7PLATFORM_INGR_REDIS_PASSWORD || '',
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
  })

  return queue

})
// Metadata Queue
app.decorate("createMetaQueue", () => {
  const queue = new Queue('METADATA', {
    connection: {
      host: process.env.R7PLATFORM_METADATA_REDIS_HOST || 'localhost',
      port: Number(process.env.R7PLATFORM_METADATA_REDIS_PORT) || 6379,
      password: process.env.R7PLATFORM_METADATA_REDIS_PASSWORD || '',
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
  })

  return queue

})
// Log Queue
app.decorate("createLogQueue", () => {
  const queue = new Queue('LOG', {
    connection: {
      host: process.env.R7PLATFORM_LOG_REDIS_HOST || 'localhost',
      port: Number(process.env.R7PLATFORM_LOG_REDIS_PORT) || 6379,
      password: process.env.R7PLATFORM_LOG_REDIS_PASSWORD || '',
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
  })

  return queue

})

// routes
app.register(require("./routes/appoint"))
app.register(require("./routes/chronic"))
app.register(require("./routes/drug"))
app.register(require("./routes/drugallergy"))
app.register(require("./routes/health_check"))
app.register(require("./routes/ipd"))
app.register(require("./routes/ipdx"))
app.register(require("./routes/ipop"))
app.register(require("./routes/lab"))
app.register(require("./routes/opd"))
app.register(require("./routes/opdx"))
app.register(require("./routes/person"))

export default app
