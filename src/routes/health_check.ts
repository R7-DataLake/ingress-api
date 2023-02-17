import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import { DateTime } from "luxon"

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
      reply.status(StatusCodes.OK)
        .send({
          status: 'ok',
          now,
          server_name: process.env.R7PLATFORM_INGR_SERVICE_HOSTNAME || 'DUMMY'
        })
    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
    }
  })

} 
