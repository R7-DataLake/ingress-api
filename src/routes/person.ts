import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import {
  StatusCodes,
  getReasonPhrase,
} from 'http-status-codes'
import { DateTime } from "luxon"
import _ from 'lodash'

const { v4: uuidv4 } = require('uuid')

// โหลด Schema
import schema from '../schema/person'
import convertCamelCase from '../utils'
import { AxiosResponse } from "axios"

export default async (fastify: FastifyInstance, _opts: any, _next: any) => {
  fastify.route({
    method: 'POST',
    url: '/person',
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
        const body: any = request.body

        let isError = false
        let metadata: any = []
        const now = DateTime.now().toSQL({ includeOffset: false })

        // convert keys
        const data = convertCamelCase.camelizeKeys(body)

        data.forEach((i: any) => {
          if (i.hospcode !== hospcode) {
            isError = true
            return
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
        const logQueue = fastify.createLogQueue()
        const ingressQueue = fastify.createIngressQueue(ingress_zone)

        const trx_id = uuidv4()
        // Add queue
        const ingressData: any = {
          file_name: 'PERSON',
          trx_id, data, hospcode,
          ingress_zone, user_id: sub,
          created_at: now
        }

        await ingressQueue.add("PERSON", ingressData)

        await metaQueue.add('PERSON', { metadata })

        const logData: any = {
          trx_id, hospcode, ingress_zone,
          user_id: sub, created_at: now,
          total_records: _.size(data),
          file_name: 'PERSON',
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
          .send({
            status: 'error',
            error: error.message
          })
      }
    }
  })
} 
