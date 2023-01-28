import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('hospcode', S.string().minLength(5).maxLength(5).required())
    .prop('hn', S.string().maxLength(50).required())
    .prop('seq', S.string().maxLength(15).required())
    .prop('datedx', S.string().maxLength(8).minLength(8).required())
    .prop('diag', S.string().maxLength(8).minLength(3).required())
    .prop('dxtype', S.enum(['1', '2', '3', '4', '5', '6', '7']).required())
    .prop('drdx', S.string().maxLength(6).required())
    .prop('dUpdate', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: schema
}