import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('hospcode', S.string().minLength(5).maxLength(10).required())
    .prop('hn', S.string().maxLength(50).required())
    .prop('seq', S.string().maxLength(15).required())
    .prop('labtest', S.string().maxLength(30).required())
    .prop('labresult', S.string().maxLength(100).required())
    .prop('dUpdate', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: schema
}