import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('hospcode', S.string().minLength(5).maxLength(10).required())
    .prop('hn', S.string().maxLength(50).required())
    .prop('an', S.string().maxLength(15).required())
    .prop('seq', S.string().maxLength(15).required())
    .prop('appoint_date', S.string().maxLength(8).minLength(8).required())
    .prop('appoint_time', S.string().maxLength(4).minLength(4).required())
    .prop('clinic', S.string().maxLength(100).required())
    .prop('remark', S.string().maxLength(255))
    .prop('dUpdate', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: schema
}