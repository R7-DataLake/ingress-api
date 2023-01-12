import S from 'fluent-json-schema';

const headerSchema = S.object()
  .prop('x-fastify-token', S.string().required())

export default {
  headers: headerSchema
}