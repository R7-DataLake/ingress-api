import S from 'fluent-json-schema'

const labSchema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('HOSPCODE', S.string().minLength(5).maxLength(5).required())
    .prop('HN', S.string().maxLength(50).required())
    .prop('SEQ', S.string().maxLength(15).required())
    .prop('LABTEST', S.string().maxLength(30).required())
    .prop('LABRESULT', S.string().maxLength(100).required())
    .prop('D_UPDATE', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: labSchema
}