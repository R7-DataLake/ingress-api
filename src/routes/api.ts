import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PersonQueue } from "r7-dataset";

import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes';

// โหลด Schema
import personSchema from '../schema/person';
import opdSchema from '../schema/opd';

export default async (fastify: FastifyInstance) => {

  // รับข้อมูล PERSON
  fastify.post('/person', {
    onRequest: [fastify.authenticate],
    schema: personSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      const data: any = request.body;
      const queues = data.map((v: any) => {
        const obj: PersonQueue = {
          name: "PERSON", data: v
        }
        return obj;
      })
      await fastify.bullmq.addBulk([{ name: "PERSON", data: queues }]);
      reply
        .status(StatusCodes.OK)
        .send(getReasonPhrase(StatusCodes.OK))
    } catch (error) {
      request.log.error(error);
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
    }

  })

  // รับข้อมูล OPD
  fastify.post('/opd', {
    onRequest: [fastify.authenticate],
    schema: opdSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      const data = request.body;
      await fastify.bullmq.add("OPD", data);
      reply
        .status(StatusCodes.OK)
        .send(ReasonPhrases.OK)
    } catch (error) {
      request.log.error(error);
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
    }

  })

} 
