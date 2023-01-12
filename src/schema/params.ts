import S from 'fluent-json-schema';

const paramsSchema = S.object()
  .prop('id', S.string().minLength(4).required())
  .prop('status', S.string().required())

export default {
  params: paramsSchema
}