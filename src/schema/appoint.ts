import S from 'fluent-json-schema'

const labSchema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('HOSPCODE', S.string().minLength(5).maxLength(5).required())
    .prop('HN', S.string().maxLength(50).required())
    .prop('AN', S.string().maxLength(15).required())
    .prop('SEQ', S.string().maxLength(15).required())
    .prop('APPOINT_DATE', S.string().maxLength(8).minLength(8).required())
    .prop('APPOINT_TIME', S.string().maxLength(4).minLength(4).required())
    .prop('CLINIC', S.string().maxLength(100).required())
    .prop('REMARK', S.string().maxLength(255))
    .prop('D_UPDATE', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: labSchema
}