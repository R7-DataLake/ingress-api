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
import schema from '../schema/opdx'
import convertCamelCase from '../utils'

export default async (fastify: FastifyInstance) => {

  fastify.route({
    method: 'POST',
    url: '/opdx',
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
        // convert keys
        const data = convertCamelCase.camelizeKeys(body)

        let isError = false

        data.forEach((i: any) => {
          if (i.hospcode !== hospcode) {
            isError = true
            return
          }
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
        const logQueue = fastify.createLogQueue()

        const now = DateTime.now().toSQL({ includeOffset: false })
        const trx_id = uuidv4()
        // Add queue
        const ingressData: any = {
          file_name: 'OPDX',
          trx_id, data, hospcode,
          ingress_zone, user_id: sub,
          created_at: now
        }

        const logData: any = {
          trx_id, hospcode, ingress_zone,
          user_id: sub, created_at: now,
          total_records: _.size(data),
          file_name: 'OPDX',
          status: 'sending',
        }

        await ingressQueue.add("OPDX", ingressData);
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
