import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('HOSPCODE', S.string().minLength(5).maxLength(10).required())
    .prop('HN', S.string().maxLength(50).required())
    .prop('DATE_DIAG', S.string().maxLength(8).minLength(8).required())
    .prop('CHRONIC', S.string().maxLength(8).minLength(3).required())
    .prop('HOSP_DX', S.string().minLength(5).maxLength(10).required())
    .prop('HOSP_RX', S.string().maxLength(10))
    .prop('D_UPDATE', S.string().maxLength(14).minLength(14).required())
)

const headerSchema = S.object()
  .prop('Authorization', S.string().required())

export default {
  body: schema,
  headers: headerSchema
}