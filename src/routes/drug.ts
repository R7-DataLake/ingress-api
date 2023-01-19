import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes';

// โหลด Schema
import drugSchema from '../schema/drug';

export default async (fastify: FastifyInstance) => {

  // รับข้อมูล DRUG
  fastify.post('/drug', {
    // Verify JWT
    onRequest: [fastify.authenticate],
    // Validate schema
    schema: drugSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      // Get json from body
      const data: any = request.body;
      // Create queue object
      const queues = data.map((value: any) => {
        const obj: any = {
          // Queue name
          name: "DRUG",
          // Queue data
          data: value
        }
        return obj;
      })
      // Add queue
      await fastify.bullmq.addBulk([{ name: "DRUG", data: queues }]);
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
