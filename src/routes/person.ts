import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'
import { DateTime } from "luxon"
import _ from 'lodash'

const { v4: uuidv4 } = require('uuid')

// โหลด Schema
import personSchema from '../schema/person'

export default async (fastify: FastifyInstance) => {

  // รับข้อมูล PERSON
  fastify.post('/person', {
    onRequest: [fastify.authenticate],
    schema: personSchema,
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

        const birth = DateTime.fromFormat(i.birth, "yyyyMMdd")
        const d_updated = DateTime.fromFormat(i.dUpdate, "yyyyMMddHHmmss")

        const obj: any = {}
        obj.hospcode = i.hospcode
        obj.hn = i.hn
        obj.cid = i.cid
        obj.fname = i.fname
        obj.lname = i.lname
        obj.sex = i.sex
        obj.birth = birth.toFormat('yyyy-MM-dd')
        obj.d_update = d_updated.toFormat('yyyy-MM-dd HH:mm:ss')
        obj.ingress_zone = ingress_zone

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
      const logQueue = fastify.createLogQueue()
      const ingressQueue = fastify.createIngressQueue(ingress_zone)

      const send_date = DateTime.now().toSQL({ includeOffset: false })
      const trx_id = uuidv4()
      // Add queue
      await ingressQueue.add("PERSON", {
        trx_id, data, hospcode,
        ingress_zone, user_id: sub,
        send_date
      })

      await metaQueue.add('PERSON', { metadata })

      await logQueue.add('INGRESS', {
        trx_id, hospcode, ingress_zone,
        user_id: sub, send_date,
        total_records: _.size(data),
        file_name: 'PERSON'
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
