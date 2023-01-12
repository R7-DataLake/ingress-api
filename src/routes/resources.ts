import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Knex } from "knex";

import { UserModel } from '../models/user'

export default async (fastify: FastifyInstance) => {

  const userModel = new UserModel();
  const db: Knex = fastify.db;

  fastify.get('/resources/users', {
    onRequest: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    request.log.info(request.user);

    try {
      const users = await userModel.read(db);
      reply
        .status(200)
        .send({ ok: true, users })
    } catch (error) {
      request.log.error(error);
      reply
        .status(500)
        .send({ ok: false, error: "Database connection failed." })
    }

  })

} 
