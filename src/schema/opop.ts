import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('hospcode', S.string().minLength(5).maxLength(10).required())
    .prop('hn', S.string().maxLength(50).required())
    .prop('seq', S.string().maxLength(15).required())
    .prop('dateop', S.string().maxLength(8).minLength(8).required())
    .prop('oper', S.string().maxLength(7).minLength(3).required())
    .prop('provider', S.string().maxLength(6).required())
    .prop('servprice', S.number().maximum(999999).default(0).required())
    .prop('dUpdate', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: schema
}