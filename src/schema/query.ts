import S from 'fluent-json-schema';

const querySchema = S.object()
  .prop('query', S.string().minLength(4).required())
  .prop('by', S.enum(['username']).required());

export default {
  querystring: querySchema
}