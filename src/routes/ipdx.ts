import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'
import { DateTime } from "luxon"

const { v4: uuidv4 } = require('uuid')

// โหลด Schema
import ipdxSchema from '../schema/ipdx'

export default async (fastify: FastifyInstance) => {

  // รับข้อมูล OPDX
  fastify.post('/ipdx', {
    // Verify JWT
    onRequest: [fastify.authenticate],
    // Validate schema
    schema: ipdxSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      // Get json from body
      const data: any = request.body
      const { ingress_zone, hospcode, sub } = request.user

      let isError = false

      data.forEach((i: any) => {
        if (i.hospcode !== hospcode) {
          isError = true
        }
      });

      if (isError) {
        return reply
          .status(StatusCodes.BAD_REQUEST)
          .send({
            error: 'This information is not your organization'
          })
      }

      const queue = fastify.createQueue(ingress_zone)

      const send_date = DateTime.now().toSQL({ includeOffset: false })
      const trx_id = uuidv4()
      // Add queue
      await queue.add("IPDX", {
        trx_id, data, hospcode,
        ingress_zone, user_id: sub,
        send_date
      })
      reply
        .status(StatusCodes.OK)
        .send({ status: 'success', trx_id, send_date })
    } catch (error: any) {
      request.log.error(error)
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
    }

  })

} 
