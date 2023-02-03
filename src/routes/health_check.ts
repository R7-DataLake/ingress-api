import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"

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
      reply.status(StatusCodes.OK).send()
    } catch (error: any) {
      request.log.error(error)
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
    }
  })

} 
