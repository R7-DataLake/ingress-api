import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'
import _ from "lodash";
import { DateTime } from "luxon";

const { v4: uuidv4 } = require('uuid')

// โหลด Schema
import ipdSchema from '../schema/ipd';
import convertCamelCase from '../utils'

export default async (fastify: FastifyInstance) => {

  // รับข้อมูล OPD
  fastify.post('/ipd', {
    onRequest: [fastify.authenticate],
    schema: ipdSchema,
  }, async (request: FastifyRequest, reply: FastifyReply) => {

    try {
      // Get json from body
      const body: any = request.body
      const data = convertCamelCase.camelizeKeys(body)

      const { ingress_zone, hospcode, sub } = request.user

      let isError = false
      let metadata: any = []
      const now = DateTime.now().toSQL({ includeOffset: false })

      data.forEach((i: any) => {
        if (i.hospcode !== hospcode) {
          isError = true
          return
        }

        const dateadm = DateTime.fromFormat(i.dateadm, "yyyyMMdd")
        const timeadm = DateTime.fromFormat(i.timeadm, "HHmm")
        const datedsc = DateTime.fromFormat(i.datedsc, "yyyyMMdd")
        const timedsc = DateTime.fromFormat(i.timedsc, "HHmm")
        const d_updated = DateTime.fromFormat(i.dUpdate, "yyyyMMddHHmmss")

        const obj: any = {}
        obj.hospcode = i.hospcode
        obj.hn = i.hn
        obj.an = i.an
        obj.dischs = i.dischs
        obj.discht = i.discht
        obj.dateadm = dateadm.toFormat('yyyy-MM-dd')
        obj.datedsc = datedsc.toFormat('yyyy-MM-dd')
        obj.timeadm = timeadm.toFormat('HH:mm')
        obj.timedsc = timedsc.toFormat('HH:mm')
        obj.d_update = d_updated.toFormat('yyyy-MM-dd HH:mm:ss')
        obj.ingress_zone = ingress_zone
        obj.created_at = now
        obj.updated_at = now

        metadata.push(obj)

      })

      if (isError) {
        return reply
          .status(StatusCodes.BAD_REQUEST)
          .send({
            error: 'This information is not your organization'
          })
      }

      const metaQueue = fastify.createMetaQueue()
      const ingressQueue = fastify.createIngressQueue(ingress_zone)
      const logQueue = fastify.createLogQueue()

      const trx_id = uuidv4()
      // Add queue
      await ingressQueue.add("IPD", {
        trx_id, data, hospcode,
        ingress_zone, user_id: sub,
        created_at: now
      })

      await metaQueue.add('IPD', { metadata })

      await logQueue.add('INGRESS', {
        trx_id, hospcode, ingress_zone,
        user_id: sub, created_at: now,
        total_records: _.size(data),
        file_name: 'IPD',
        status: 'sending'
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
