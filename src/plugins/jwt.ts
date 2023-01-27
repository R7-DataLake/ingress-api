import { FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

module.exports = fp(async (fastify: any, opts: any) => {
  fastify.register(require("@fastify/jwt"), opts)

  fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply
        .status(StatusCodes.UNAUTHORIZED)
        .send(getReasonPhrase(StatusCodes.UNAUTHORIZED))
    }
  })
}, { fastify: '4.x', name: 'fastify/jwt' })