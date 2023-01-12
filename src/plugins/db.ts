import fp from 'fastify-plugin'
import Knex from "knex";

module.exports = fp(async function (fastify: any, opts: any, next: any) {

  try {
    const handler = Knex(opts.options);

    fastify
      .decorate("db", handler)
      .addHook('onClose', (instance: any, done: any) => {
        if (instance.knex === handler) {
          instance.knex.destroy();
          delete instance.knex;
        };
        done();
      });

  } catch (err: any) {
    next(err);
  }

}, { fastify: '4.x', name: 'fastify/db' })