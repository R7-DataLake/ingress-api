import { FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

module.exports = fp(async (fastify: any, _opts: any) => {

  fastify.decorate("checkowner", async (request: FastifyRequest, reply: FastifyReply, done: any) => {
    try {
      const hospcode = request.user.hospcode
      const data: any = request.body

      let isError = false

      data.forEach((i: any) => {
        if (i.hospcode !== hospcode) {
          isError = true
        }
      });

      if (isError) {
        reply
          .status(StatusCodes.BAD_REQUEST)
          .send({
            error: 'This information is not your organization'
          })
      }

      done()

    } catch (error: any) {
      request.log.error(error)
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  })
}, { fastify: '4.x', name: 'fastify/validate-hospcode' })