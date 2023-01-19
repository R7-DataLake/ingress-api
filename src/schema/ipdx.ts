import S from 'fluent-json-schema'

const ipdxSchema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('HOSPCODE', S.string().minLength(5).maxLength(5).required())
    .prop('HN', S.string().maxLength(50).required())
    .prop('AN', S.string().maxLength(15).required())
    .prop('DIAG', S.string().maxLength(8).minLength(3).required())
    .prop('DXTYPE', S.enum(['1', '2', '3', '4', '5', '6', '7']).required())
    .prop('DRDX', S.string().maxLength(6).required())
    .prop('D_UPDATE', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: ipdxSchema
}