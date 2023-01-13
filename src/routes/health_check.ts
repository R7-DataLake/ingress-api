import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";

export default async (fastify: FastifyInstance) => {

  fastify.get('/health-check', {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: '1 minute'
      }
    }
  }, async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      reply.status(StatusCodes.OK).send()
    } catch (e) {
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
    }
  })

} 
