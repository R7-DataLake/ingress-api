import * as jsonwebtoken from 'jsonwebtoken';
import { AxiosInstance } from 'axios';
import knex from 'knex';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: jsonwebtoken
    authenticate: any
    axios: AxiosInstance | any
    db: knex | any
  }

  interface FastifyRequest {
    jwtVerify: any
    user: any
  }

}
