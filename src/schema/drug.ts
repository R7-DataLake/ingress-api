import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('hospcode', S.string().minLength(5).maxLength(10).required())
    .prop('hn', S.string().maxLength(50).required())
    .prop('an', S.string().maxLength(15).required())
    .prop('seq', S.string().maxLength(15).required())
    .prop('did', S.string().maxLength(30).required())
    .prop('amount', S.number().maximum(999999).default(0).required())
    .prop('drugprice', S.number().maximum(999999).default(0).required())
    .prop('drugcost', S.number().maximum(999999).default(0).required())
    .prop('unit', S.string().maxLength(50).required())
    .prop('unitPack', S.string().maxLength(20).required())
    .prop('sigcode', S.string().maxLength(50).required())
    .prop('provider', S.string().maxLength(6))
    .prop('dUpdate', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: schema
}