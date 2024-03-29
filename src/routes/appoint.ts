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
import schema from '../schema/appoint'
import convertCamelCase from '../utils'

export default async (fastify: FastifyInstance) => {

  fastify.route({
    method: 'POST',
    url: '/appoint',
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

        const now = DateTime.now().toSQL({ includeOffset: false })

        let appoint: any = []

        let isError = false

        data.forEach((i: any) => {
          if (i.hospcode !== hospcode) {
            isError = true
            return
          }

          const appoint_date = DateTime.fromFormat(i.appointDate, "yyyyMMdd")
          const appoint_time = DateTime.fromFormat(i.appointTime, "HHmm")

          const obj: any = {}
          obj.hospcode = i.hospcode
          obj.hn = i.hn
          obj.appoint_date = appoint_date.toFormat('yyyy-MM-dd')
          obj.appoint_time = appoint_time.toFormat('HH:mm:ss')
          obj.remark = i.remark
          obj.created_at = now
          obj.updated_at = now

          appoint.push(obj);

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

        const ingressQueue = fastify.createIngressQueue(ingress_zone)
        const healthProfileQueue = fastify.createHealthProfileQueue()
        const logQueue = fastify.createLogQueue()

        const trx_id = uuidv4()
        // Add queue
        const ingressData: any = {
          file_name: 'APPOINT',
          trx_id, data, hospcode,
          ingress_zone, user_id: sub,
          created_at: now
        }

        const logData: any = {
          trx_id, hospcode, ingress_zone,
          user_id: sub, created_at: now,
          total_records: _.size(data),
          file_name: 'APPOINT',
          status: 'sending'
        }

        await ingressQueue.add("APPOINT", ingressData)
        await healthProfileQueue.add('APPOINT', { appoint })
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
