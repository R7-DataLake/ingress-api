import S from 'fluent-json-schema'

const opopSchema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('HOSPCODE', S.string().minLength(5).maxLength(5).required())
    .prop('HN', S.string().maxLength(50).required())
    .prop('SEQ', S.string().maxLength(15).required())
    .prop('DATEOP', S.string().maxLength(8).minLength(8).required())
    .prop('OPER', S.string().maxLength(7).minLength(3).required())
    .prop('DROPID', S.string().maxLength(6).required())
    .prop('SERVPRICE', S.number().maximum(999999).default(0).required())
    .prop('D_UPDATE', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: opopSchema
}