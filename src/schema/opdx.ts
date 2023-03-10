import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('HOSPCODE', S.string().minLength(5).maxLength(10).required())
    .prop('HN', S.string().maxLength(50).required())
    .prop('SEQ', S.string().maxLength(15).required())
    .prop('DATEDX', S.string().maxLength(8).minLength(8).required())
    .prop('DIAG', S.string().maxLength(8).minLength(3).required())
    .prop('DXTYPE', S.enum(['1', '2', '3', '4', '5', '6', '7']).required())
    .prop('PROVIDER', S.string().maxLength(6).required())
    .prop('D_UPDATE', S.string().maxLength(14).minLength(14).required())
)

const headerSchema = S.object()
  .prop('Authorization', S.string().required())

export default {
  body: schema,
  headers: headerSchema
}