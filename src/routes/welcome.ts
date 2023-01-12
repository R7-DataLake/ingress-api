import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Knex } from "knex";
import * as crypto from 'crypto'

import { UserModel } from '../models/user'
import { LoginModel } from '../models/login'

export default async (fastify: FastifyInstance) => {

  const userModel = new UserModel();
  const loginModel = new LoginModel();
  const db: Knex = fastify.db;

  fastify.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: 'Hello world!' })
  })

  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const body: any = request.body;
    const { username, password } = body;

    reply
      .status(200)
      .send({ ok: true, info: { username, password } })

  })

  fastify.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      const users = await userModel.read(db);
      reply
        .status(200)
        .send({ ok: true, users })
    } catch (error) {
      console.error(error);
      reply
        .status(500)
        .send({ ok: false, error: "Database connection failed." })
    }

  })

  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const body: any = request.body
    const username = body.username
    const password = body.password

    try {
      const encPassword = crypto.createHash('md5').update(password).digest('hex')
      const rs: any = await loginModel.login(db, username, encPassword)

      if (rs.length > 0) {
        const user: any = rs[0]
        const payload: any = {
          userId: user.user_id,
          firstName: user.first_name,
          lastName: user.last_name
        }

        const token = fastify.jwt.sign(payload)
        reply.send({ token })
      } else {
        reply.status(401).send({ ok: false, message: 'Login failed' })
      }
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({ message: error.message })
    }
  })

} 
