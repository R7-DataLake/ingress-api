import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes';

// โหลด Schema
import labSchema from '../schema/lab';

export default async (fastify: FastifyInstance) => {

  // รับข้อมูล LAB
  fastify.post('/lab', {
    onRequest: [fastify.authenticate],
    schema: labSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      // Get json from body
      const data: any = request.body;
      // Add queue
      await fastify.bullmq.add("LAB", data);
      // Reply
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

} 
