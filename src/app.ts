import { Queue } from 'bullmq'
import fastify from 'fastify'

const app = fastify({
  bodyLimit: 2 * 1024 * 1024, // 2mb
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'info' : 'error',
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
app.register(require('@fastify/cors'), {
  origin: 'https://r7.moph.go.th',
  methods: ['GET', 'POST'],
})

// Rate limit
const Redis = require('ioredis')
const redis = new Redis({
  connectionName: 'ingress-resis',
  host: process.env.R7PLATFORM_INGR_REDIS_RATELIMIT_HOST || 'localhost',
  port: Number(process.env.R7PLATFORM_INGR_REDIS_RATELIMIT_PORT) || 6379,
  password: process.env.R7PLATFORM_INGR_REDIS_RATELIMIT_PASSWORD || '',
  connectTimeout: 500,
  maxRetriesPerRequest: 3
})

app.register(require('@fastify/rate-limit'), {
  global: true,
  nameSpace: 'r7platform-ingress-ratelimit-',
  max: 1000,
  timeWindow: '1h',
  ban: 3,
  keyGenerator: (request: any) => {
    return request.headers['x-real-ip'];
  },
  redis: redis
})

app.addHook('onSend', (_request: any, reply: any, _playload: any, done: any) => {
  reply.headers({
    'X-Powered-By': 'R7 Health Platform System',
    'X-Processed-By': process.env.R7PLATFORM_INGR_SERVICE_HOSTNAME || 'dummy-server',
  })

  done()

})

app.addHook('onRequest', (request, reply, done) => {
  const accessToken = request.headers.authorization?.split(' ')[1];
  request.accessToken = accessToken;
  done()
})

// Queue
app.decorate("createIngressQueue", (zoneName: any) => {
  const queue = new Queue(zoneName, {
    connection: {
      host: process.env.R7PLATFORM_INGR_REDIS_HOST || 'localhost',
      port: Number(process.env.R7PLATFORM_INGR_REDIS_PORT) || 6379,
      password: process.env.R7PLATFORM_INGR_REDIS_PASSWORD || '',
      enableOfflineQueue: true,
      retryStrategy(times: any) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    },
    defaultJobOptions: {
      delay: 30000,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: {
        age: 3600, // keep up to 1 hour
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
      enableOfflineQueue: true,
    },
    defaultJobOptions: {
      delay: 30000,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: {
        age: 3600, // keep up to 1 hour
      },
      removeOnFail: {
        age: 2 * 24 * 3600, // keep up to 48 hours
      },
    }
  })

  return queue

})

// Health profile Queue
app.decorate("createHealthProfileQueue", () => {
  const queue = new Queue('HEALTH_PROFILE', {
    connection: {
      host: process.env.R7PLATFORM_METADATA_REDIS_HOST || 'localhost',
      port: Number(process.env.R7PLATFORM_METADATA_REDIS_PORT) || 6379,
      password: process.env.R7PLATFORM_METADATA_REDIS_PASSWORD || '',
      enableOfflineQueue: true,
    },
    defaultJobOptions: {
      delay: 30000,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: {
        age: 3600, // keep up to 1 hour
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
      enableOfflineQueue: true,
    },
    defaultJobOptions: {
      delay: 30000,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: {
        age: 3600, // keep up to 1 hour
      },
      removeOnFail: {
        age: 2 * 24 * 3600, // keep up to 48 hours
      },
    }
  })

  return queue

})

// app.register(require('@fastify/circuit-breaker'), {});

app.register(require('fastify-axios'), {
  timeout: 60000
})

// routes
app.register(require("./routes/appoint"))
app.register(require("./routes/chronic"))
app.register(require("./routes/opdrug"))
app.register(require("./routes/ipdrug"))
app.register(require("./routes/drugallergy"))
app.register(require("./routes/health_check"))
app.register(require("./routes/ipd"))
app.register(require("./routes/ipdx"))
app.register(require("./routes/ipop"))
app.register(require("./routes/lab"))
app.register(require("./routes/opd"))
app.register(require("./routes/opop"))
app.register(require("./routes/opdx"))
app.register(require("./routes/person"))

export default app
