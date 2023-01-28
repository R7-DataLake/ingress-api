import * as jsonwebtoken from 'jsonwebtoken';
import { Queue } from 'bullmq';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: jsonwebtoken
    authenticate: any
    bullmq: Queue
    checkowner: any
  }

  interface FastifyRequest {
    jwtVerify: any
    user: any
  }
}