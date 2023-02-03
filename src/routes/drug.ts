import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'

// โหลด Schema
import drugSchema from '../schema/drug'

export default async (fastify: FastifyInstance) => {

  // รับข้อมูล DRUG
  fastify.post('/drug', {
    // Verify JWT
    onRequest: [fastify.authenticate],
    // Validate schema
    schema: drugSchema,
    // Check data owner
    preHandler: fastify.checkowner
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      // Get json from body
      const data: any = request.body
      const { ingress_zone } = request.user
      const queue = fastify.createQueue(ingress_zone)
      // Add queue
      await queue.add("DRUG", data)
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
