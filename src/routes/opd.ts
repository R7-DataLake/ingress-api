import { AxiosResponse } from "axios"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'
import _ from "lodash"
import { DateTime } from "luxon"

const { v4: uuidv4 } = require('uuid')

// โหลด Schema
import schema from '../schema/opd'
import convertCamelCase from '../utils'

export default async (fastify: FastifyInstance) => {

  fastify.route({
    method: 'POST',
    url: '/opd',
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

        // Get json from body
        const body: any = request.body;
        const { ingress_zone, hospcode, sub } = response.data;

        let isError = false
        const now = DateTime.now().toSQL({ includeOffset: false })
        let metadata: any = []
        let screening: any = []

        // convert keys
        const data = convertCamelCase.camelizeKeys(body)

        data.forEach((i: any) => {
          if (i.hospcode !== hospcode) {
            isError = true
            return
          }

          const date_serv = DateTime.fromFormat(i.dateServ, "yyyyMMdd")
          const time_serv = DateTime.fromFormat(i.timeServ, "HHmmss")
          const d_updated = DateTime.fromFormat(i.dUpdate, "yyyyMMddHHmmss")

          const objMetadata: any = {}
          objMetadata.hospcode = i.hospcode
          objMetadata.hn = i.hn
          objMetadata.seq = i.seq
          objMetadata.date_serv = date_serv.toFormat('yyyy-MM-dd')
          objMetadata.time_serv = time_serv.toFormat('HH:mm:ss')
          objMetadata.chiefcomp = i.chiefcomp
          objMetadata.diag_text = i.diagText
          objMetadata.d_update = d_updated.toFormat('yyyy-MM-dd HH:mm:ss')
          objMetadata.ingress_zone = ingress_zone
          objMetadata.created_at = now
          objMetadata.updated_at = now

          const objScreening: any = {}
          objScreening.hospcode = i.hospcode
          objScreening.hn = i.hn
          objScreening.date_serv = date_serv.toFormat('yyyy-MM-dd')
          objScreening.time_serv = time_serv.toFormat('HH:mm:ss')
          objScreening.sbp = i.sbp
          objScreening.dbp = i.dbp
          objScreening.rr = i.rr
          objScreening.pr = i.pr
          objScreening.height = i.height
          objScreening.weight = i.weight
          objScreening.created_at = now
          objScreening.updated_at = now

          screening.push(objScreening);
          metadata.push(objMetadata)

        });

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
        const logQueue = fastify.createLogQueue()
        const healthProfileQueue = fastify.createHealthProfileQueue()
        const ingressQueue = fastify.createIngressQueue(ingress_zone)

        const trx_id = uuidv4()
        // Add queue
        const ingressData: any = {
          file_name: 'OPD',
          trx_id, data, hospcode,
          ingress_zone, user_id: sub,
          created_at: now
        }

        const logData: any = {
          trx_id, hospcode, ingress_zone,
          user_id: sub, created_at: now,
          total_records: _.size(data),
          file_name: 'OPD',
          status: 'sending',
        }

        await ingressQueue.add("OPD", ingressData)
        await metaQueue.add('OPD', { metadata })
        await healthProfileQueue.add('SCREENING', { screening })
        await logQueue.add('INGRESS', logData)

        reply
          .status(StatusCodes.OK)
          .send({ status: 'success', trx_id })
      } catch (error: any) {
        request.log.error(error);
        let message: any;
        if (_.has(error, 'message')) {
          message = error.message;
        } else {
          message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
        }
        reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({
            status: 'error',
            error: message,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR
          });
      }
    }
  })

} 
