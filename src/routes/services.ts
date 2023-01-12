import { AxiosResponse } from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async (fastify: FastifyInstance) => {
  fastify.get('/services/test', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const rs: AxiosResponse = await fastify.axios.httpbin.get('/json')
      reply
        .status(200)
        .send({ ok: true, results: rs.data })
    } catch (error) {
      reply
        .status(500)
        .send({ ok: false, error })
    }
  })

  fastify.get('/services/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const rs: AxiosResponse = await fastify.axios.randomuser.get('/?gender=female')
    reply
      .status(200)
      .send({ ok: true, results: rs.data })
  })

  fastify.get('/services/ip', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const rs: AxiosResponse = await fastify.axios.httpbin.get('/ip')
      reply
        .status(200)
        .send({ ok: true, results: rs.data })
    } catch (error) {
      reply
        .status(500)
        .send({ ok: false, error })
    }
  })

  fastify.get('/services/bearer', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const rs: AxiosResponse = await fastify.axios.httpbin.get('/bearer')
      reply
        .status(200)
        .send({ ok: true, results: rs.data })
    } catch (error) {
      reply
        .status(500)
        .send({ ok: false, error })
    }
  })
} 
