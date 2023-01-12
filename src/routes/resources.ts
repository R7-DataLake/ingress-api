import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Knex } from "knex";
import * as crypto from 'crypto'

import { UserModel } from '../models/user'
import { LoginModel } from '../models/login'

export default async (fastify: FastifyInstance) => {

  const userModel = new UserModel();
  const db: Knex = fastify.db;

  fastify.get('/users', {
    onRequest: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    console.log(request.user);

    try {
      const users = await userModel.read(db);
      reply
        .status(200)
        .send({ ok: true, users })
    } catch (error) {
      console.error(error);
      reply
        .status(500)
        .send({ ok: false, error: "Database connection failed." })
    }

  })

} 
