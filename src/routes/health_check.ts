import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import { DateTime } from "luxon"

const { v4: uuidv4 } = require('uuid')

export default async (fastify: FastifyInstance) => {

  fastify.get('/health-check', {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: '1 minute'
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const now = DateTime.now().toSQL({ includeOffset: false })
      const trx_id = uuidv4()
      reply.status(StatusCodes.OK)
        .send({ status: 'ok', trx_id, now })
    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
    }
  })

} 
