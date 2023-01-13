import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
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

  // รับข้อมูล OPD
  fastify.post('/opd', {
    onRequest: [fastify.authenticate],
    schema: opdSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
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
