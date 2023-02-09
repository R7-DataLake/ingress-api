import * as jsonwebtoken from 'jsonwebtoken'
import { Queue } from 'bullmq'

declare module 'fastify' {
  interface FastifyInstance {
    jwt: jsonwebtoken
    authenticate: any
    createIngressQueue(string): any
    createMetaQueue(): any
    createLogQueue(): any
  }

  interface FastifyRequest {
    jwtVerify: any
    user: any
  }
}