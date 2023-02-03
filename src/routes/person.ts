import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'

// โหลด Schema
import personSchema from '../schema/person'

export default async (fastify: FastifyInstance) => {

  // รับข้อมูล PERSON
  fastify.post('/person', {
    onRequest: [fastify.authenticate],
    schema: personSchema,
    // Check data owner
    preHandler: fastify.checkowner
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      // Get json from body
      const data: any = request.body
      const { ingress_zone } = request.user
      const queue = fastify.createQueue(ingress_zone)
      // Add queue
      await queue.add("APPOINT", data)
      // Reply
      reply
        .status(StatusCodes.OK)
        .send(getReasonPhrase(StatusCodes.OK))
    } catch (error: any) {
      request.log.error(error)
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
    }

  })

} 
