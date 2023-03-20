import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { getReasonPhrase, StatusCodes } from "http-status-codes"
import _ from "lodash"
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
          server_name: process.env.R7PLATFORM_INGR_SERVICE_HOSTNAME || 'DUMMY',
          version: '1.0.1',
          build: '202303102135'
        })
    } catch (error: any) {
      request.log.error(error);
      let message: any;
      if (_.has(error, 'message')) {
        message = error.message;
      } else {
        message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
      }
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          status: 'error',
          error: message,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
  })

} 
