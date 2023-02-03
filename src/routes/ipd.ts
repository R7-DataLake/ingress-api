import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'

// โหลด Schema
import ipdSchema from '../schema/ipd';

export default async (fastify: FastifyInstance) => {

  // รับข้อมูล OPD
  fastify.post('/ipd', {
    onRequest: [fastify.authenticate],
    schema: ipdSchema,
    // Check data owner
    preHandler: fastify.checkowner
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      // Get json from body
      const data: any = request.body
      const { ingress_zone } = request.user
      const queue = fastify.createQueue(ingress_zone)
      // Add queue
      await queue.add("IPD", data)
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
