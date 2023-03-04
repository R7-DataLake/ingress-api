import { AxiosResponse } from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'
import _ from "lodash";
import { DateTime } from "luxon";

const { v4: uuidv4 } = require('uuid')

// โหลด Schema
import schema from '../schema/ipd';
import convertCamelCase from '../utils'

export default async (fastify: FastifyInstance) => {

  fastify.route({
    method: 'POST',
    url: '/ipd',
    schema: schema,
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const accessToken: any = request.accessToken;
        // Verify token
        const urlIntrospect = process.env.R7PLATFORM_INGR_INTROSPECT_ENDPOINT;
        const response: AxiosResponse = await fastify.axios.post(urlIntrospect, {}, {
          headers: {
            'Authorization': 'Bearer ' + accessToken
          }
        });

        const { ingress_zone, hospcode, sub } = response.data;
        // Get json from body
        const body: any = request.body;

        const data = convertCamelCase.camelizeKeys(body)

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
              error: getReasonPhrase(StatusCodes.BAD_REQUEST),
              message: 'ไม่ใช่ข้อมูลของหน่วยงาน',
              statusCode: StatusCodes.BAD_REQUEST
            })
        }

        const metaQueue = fastify.createMetaQueue()
        const ingressQueue = fastify.createIngressQueue(ingress_zone)
        const logQueue = fastify.createLogQueue()

        const trx_id = uuidv4()
        // Add queue
        const ingressData: any = {
          file_name: 'IPD',
          trx_id, data, hospcode,
          ingress_zone, user_id: sub,
          created_at: now
        }
        await ingressQueue.add("IPD", ingressData)

        await metaQueue.add('IPD', { metadata })

        const logData: any = {
          trx_id, hospcode, ingress_zone,
          user_id: sub, created_at: now,
          total_records: _.size(data),
          file_name: 'IPD',
          status: 'sending'
        }
        await logQueue.add('INGRESS', logData)

        reply
          .status(StatusCodes.OK)
          .send({ status: 'success', trx_id })
      } catch (error: any) {
        request.log.error(error)
        reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
      }
    }
  })

} 
