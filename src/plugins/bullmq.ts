import fp from 'fastify-plugin'
import { Queue } from 'bullmq';

module.exports = fp(async (fastify: any, opts: any, done: any) => {
  const queue = new Queue(opts.queue_name, opts.options);
  fastify.decorate('bullmq', queue)
  done();

}, { fastify: '4.x', name: 'fastify/bullmq' })