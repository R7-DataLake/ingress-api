import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('hospcode', S.string().minLength(5).maxLength(5).required())
    .prop('informhosp', S.string().minLength(5).maxLength(5).required())
    .prop('hn', S.string().maxLength(50).required())
    .prop('daterecord', S.string().maxLength(8).minLength(8).required())
    .prop('dname', S.string().maxLength(255).required())
    .prop('typedx', S.enum(['1', '2', '3', '4', '5']).required())
    .prop('alevel', S.enum(['1', '2', '3', '4', '5', '6', '7', '8']).required())
    .prop('symptom', S.string().maxLength(2).required())
    .prop('informant', S.enum(['1', '2', '3', '4', '5']))
    .prop('informhosp', S.string().minLength(5).maxLength(5))
    .prop('provider', S.string().maxLength(6))
    .prop('dUpdate', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: schema
}