import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('HOSPCODE', S.string().minLength(5).maxLength(10).required())
    .prop('HN', S.string().maxLength(50).required())
    .prop('AN', S.string().maxLength(15).required())
    .prop('DID', S.string().maxLength(30).required())
    .prop('AMOUNT', S.number().maximum(999999).default(0).required())
    .prop('DRUGPRICE', S.number().maximum(999999).default(0).required())
    .prop('DRUGCOST', S.number().maximum(999999).default(0).required())
    .prop('UNIT', S.string().maxLength(50).required())
    .prop('UNIT_PACK', S.string().maxLength(20))
    .prop('SIGCODE', S.string().maxLength(50).required())
    .prop('PROVIDER', S.string().maxLength(6))
    .prop('D_UPDATE', S.string().maxLength(14).minLength(14).required())
)

const headerSchema = S.object()
  .prop('Authorization', S.string().required())

export default {
  body: schema,
  headers: headerSchema
}