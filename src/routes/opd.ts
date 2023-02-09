import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'
import _ from "lodash"
import { DateTime } from "luxon"

const { v4: uuidv4 } = require('uuid')

// โหลด Schema
import opdSchema from '../schema/opd'

export default async (fastify: FastifyInstance) => {

  // รับข้อมูล OPD
  fastify.post('/opd', {
    onRequest: [fastify.authenticate],
    schema: opdSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      // Get json from body
      const data: any = request.body
      const { ingress_zone, hospcode, sub } = request.user

      let isError = false

      let metadata: any = []

      data.forEach((i: any) => {
        if (i.hospcode !== hospcode) {
          isError = true
        }

        const date_serv = DateTime.fromFormat(i.dateServ, "yyyyMMdd")
        const time_serv = DateTime.fromFormat(i.timeServ, "HHmmss")
        const d_updated = DateTime.fromFormat(i.dUpdate, "yyyyMMddHHmmss")

        const obj: any = {}
        obj.hospcode = i.hospcode
        obj.hn = i.hn
        obj.seq = i.seq
        obj.date_serv = date_serv.toFormat('yyyy-MM-dd')
        obj.time_serv = time_serv.toFormat('HH:mm:ss')
        obj.chiefcomp = i.chiefcomp
        obj.diag_text = i.diagText
        obj.d_update = d_updated.toFormat('yyyy-MM-dd HH:mm:ss')
        obj.ingress_zone = ingress_zone
        metadata.push(obj)

      });

      if (isError) {
        return reply
          .status(StatusCodes.BAD_REQUEST)
          .send({
            error: 'This information is not your organization'
          })
      }

      const metaQueue = fastify.createMetaQueue()
      const logQueue = fastify.createLogQueue()
      const ingressQueue = fastify.createIngressQueue(ingress_zone)

      const now = DateTime.now().toSQL({ includeOffset: false })
      const trx_id = uuidv4()
      // Add queue
      await ingressQueue.add("OPD", {
        trx_id, data, hospcode,
        ingress_zone, user_id: sub,
        created_at: now
      })

      await metaQueue.add('OPD', { metadata })

      await logQueue.add('INGRESS', {
        trx_id, hospcode, ingress_zone,
        user_id: sub, created_at: now,
        total_records: _.size(data),
        file_name: 'OPD',
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
