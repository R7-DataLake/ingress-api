import S from 'fluent-json-schema'

const ipopSchema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('hospcode', S.string().minLength(5).maxLength(5).required())
    .prop('hn', S.string().maxLength(50).required())
    .prop('an', S.string().maxLength(15).required())
    .prop('oper', S.string().maxLength(7).minLength(3).required())
    .prop('optype', S.enum(['1', '2', '3']).required())
    .prop('dropid', S.string().maxLength(6).required())
    .prop('datein', S.string().maxLength(8).minLength(8).required())
    .prop('timein', S.string().maxLength(4).minLength(4).required())
    .prop('dateout', S.string().maxLength(8).minLength(8).required())
    .prop('timeout', S.string().maxLength(4).minLength(4).required())
    .prop('dUpdate', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: ipopSchema
}