import * as jsonwebtoken from 'jsonwebtoken'
import { Queue } from 'bullmq'
import { AxiosInstance } from 'axios';
declare module 'fastify' {
  interface FastifyInstance {
    axios: AxionInstance
    createIngressQueue(string): any
    createMetaQueue(): any
    createLogQueue(): any
    circuitBreaker(): any
  }

  interface FastifyRequest {
    accessToken: any
  }
}