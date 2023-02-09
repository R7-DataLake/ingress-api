import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'
import _ from "lodash"
import { DateTime } from "luxon"

const { v4: uuidv4 } = require('uuid')

// โหลด Schema
import opdxSchema from '../schema/opdx'

export default async (fastify: FastifyInstance) => {

  // รับข้อมูล OPDX
  fastify.post('/opdx', {
    // Verify JWT
    onRequest: [fastify.authenticate],
    // Validate schema
    schema: opdxSchema,
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

      const ingressQueue = fastify.createIngressQueue(ingress_zone)
      const logQueue = fastify.createLogQueue()

      const now = DateTime.now().toSQL({ includeOffset: false })
      const trx_id = uuidv4()
      // Add queue
      await ingressQueue.add("OPDX", {
        trx_id, data, hospcode,
        ingress_zone, user_id: sub,
        created_at: now
      })

      await logQueue.add('INGRESS', {
        trx_id, hospcode, ingress_zone,
        user_id: sub, created_at: now,
        total_records: _.size(data),
        file_name: 'OPDX',
        status: 'sending',
      })

      reply
        .status(StatusCodes.OK)
        .send({ status: 'success', trx_id })
    } catch (error: any) {
      request.log.error(error)
      reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
    }

  })

} 
