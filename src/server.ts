import pino from 'pino';
import fastify from 'fastify'
import { join } from 'path';

const startServer = async () => {
  try {

    require('dotenv').config({ path: join(__dirname, '../config.conf') })

    const server = fastify({
      logger: {
        transport:
          process.env.NODE_ENV === 'development'
            ? {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname'
              }
            }
            : undefined
      }
    })
    server.register(require('@fastify/formbody'))
    server.register(require('@fastify/cors'))

    await server.register(import('@fastify/rate-limit'), {
      global: false,
      max: 100,
      timeWindow: '1 minute'
    })

    server.register(require('./plugins/db'), {
      options: {
        client: 'pg',
        connection: {
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'postgres',
          port: Number(process.env.DB_PORT) || 5432,
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'test',
        },
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

    server.register(require('./plugins/jwt'), {
      secret: process.env.SECRET_KEY || '@1234567890@',
      sign: {
        iss: 'r7.moph.go.th',
        expiresIn: '1d'
      },
      verify: { allowedIss: 'r7.moph.go.th' },
      messages: {
        badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
        noAuthorizationInHeaderMessage: 'Autorization header is missing!',
        authorizationTokenExpiredMessage: 'Authorization token expired',
        authorizationTokenInvalid: (err: any) => {
          return `Authorization token is invalid: ${err.message}`
        }
      }
    })

    server.register(require('fastify-axios'), {
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

    server.get('/health-check', {
      config: {
        rateLimit: {
          max: 3,
          timeWindow: '1 minute'
        }
      }
    }, async (request: any, reply: any) => {
      try {
        reply.status(200).send()
      } catch (e) {
        reply.status(500).send()
      }
    })

    server.register(require("./routes/welcome"), { prefix: '/' })
    server.register(require("./routes/services"), { prefix: '/services' })
    server.register(require("./routes/resources"), { prefix: '/resources' })
    server.register(require("./routes/schema"), { prefix: '/schema' })


    if (process.env.NODE_ENV === 'production') {
      for (const signal of ['SIGINT', 'SIGTERM']) {
        process.on(signal, () =>
          server.close().then((err: any) => {
            console.log(`close application on ${signal}`)
            process.exit(err ? 1 : 0)
          }),
        )
      }
    }

    server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    })

  } catch (e) {
    console.error(e)
  }
}

startServer()