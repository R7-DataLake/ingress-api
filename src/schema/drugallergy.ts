import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(500).items(
  S.object()
    .prop('HOSPCODE', S.string().minLength(5).maxLength(10).required())
    .prop('INFORMHOSP', S.string().minLength(5).maxLength(5).required())
    .prop('HN', S.string().maxLength(50).required())
    .prop('DATERECORD', S.string().maxLength(8).minLength(8).required())
    .prop('DNAME', S.string().maxLength(255).required())
    .prop('TYPEDX', S.enum(['1', '2', '3', '4', '5']).required())
    .prop('ALEVEL', S.enum(['1', '2', '3', '4', '5', '6', '7', '8']).required())
    .prop('SYMPTOM', S.string().maxLength(2).required())
    .prop('INFORMANT', S.enum(['1', '2', '3', '4', '5']))
    .prop('INFORMHOSP', S.string().minLength(5).maxLength(10))
    .prop('PROVIDER', S.string().maxLength(6))
    .prop('D_UPDATE', S.string().maxLength(14).minLength(14).required())
)

const headerSchema = S.object()
  .prop('Authorization', S.string().required())

export default {
  body: schema,
  headers: headerSchema
}