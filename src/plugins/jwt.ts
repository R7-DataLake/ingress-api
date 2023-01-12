import { FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'

module.exports = fp(async (fastify: any, opts: any) => {
  fastify.register(require("@fastify/jwt"), opts)

  fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.status(401).send(err)
    }
  })
}, { fastify: '4.x', name: 'fastify/jwt' })