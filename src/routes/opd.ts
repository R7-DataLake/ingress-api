import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'

// โหลด Schema
import opdSchema from '../schema/opd'

export default async (fastify: FastifyInstance) => {

  // รับข้อมูล OPD
  fastify.post('/opd', {
    onRequest: [fastify.authenticate],
    schema: opdSchema,
    // Check data owner
    preHandler: fastify.checkowner
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      // Get json from body
      const data: any = request.body
      const { ingress_zone, hospcode } = request.user

      let isError = false

      data.forEach((i: any) => {
        if (i.hospcode !== hospcode) {
          isError = true
        }
      });

      if (isError) {
        return reply
          .status(StatusCodes.BAD_REQUEST)
          .send({
            error: 'This information is not your organization'
          })
      }

      const queue = fastify.createQueue(ingress_zone)

      // Add queue
      await queue.add("OPD", data)
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
