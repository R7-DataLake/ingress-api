import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import registerSchema from '../schema/register';
import querySchema from '../schema/query';
import paramsSchema from '../schema/params';
import headerSchema from '../schema/header';

export default async (fastify: FastifyInstance) => {

  fastify.post('/schema/register', { schema: registerSchema, attachValidation: false }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body: any = request.body;
    const { username, password, first_name, last_name, sex } = body;

    reply
      .status(200)
      .send({ ok: true, info: { username, password, first_name, last_name, sex } })

  })

  fastify.get('/schema/params/:id/:status', { schema: paramsSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params: any = request.params;
    reply
      .status(200)
      .send({ ok: true, params })
  })

  fastify.get('/schema/query', { schema: querySchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query: any = request.query;
    reply
      .status(200)
      .send({ ok: true, query })
  })

  fastify.get('/schema/header', { schema: headerSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const header: any = request.headers;
    reply
      .status(200)
      .send({ ok: true, header })
  })

} 
