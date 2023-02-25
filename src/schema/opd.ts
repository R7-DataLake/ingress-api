import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('HOSPCODE', S.string().minLength(5).maxLength(10).required())
    .prop('HN', S.string().maxLength(50).required())
    .prop('CLINIC', S.string().maxLength(10).required())
    .prop('DATE_SERV', S.string().maxLength(8).minLength(8).required())
    .prop('TIME_SERV', S.string().maxLength(6).minLength(6).required())
    .prop('SEQ', S.string().maxLength(15).required())
    .prop('CHIEFCOMP', S.string().maxLength(255).required())
    .prop('BTEMP', S.number().maximum(100))
    .prop('SBP', S.number().minimum(40).maximum(200))
    .prop('DBP', S.number().minimum(40).maximum(200))
    .prop('PR', S.number().minimum(10).maximum(200))
    .prop('RR', S.number().minimum(10).maximum(200))
    .prop('TYPEIN', S.string().maxLength(6).required())
    .prop('TYPEOUT', S.string().maxLength(6).required())
    .prop('INS_TYPE', S.string().maxLength(6).required())
    .prop('INS_NUMBER', S.string().maxLength(15))
    .prop('INS_HOSPMAIN', S.string().maxLength(10).minLength(5))
    .prop('INS_HOSPSUB', S.string().maxLength(10).minLength(5))
    .prop('DIAG_TEXT', S.string().maxLength(255))
    .prop('D_UPDATE', S.string().maxLength(14).minLength(14).required())
)

const headerSchema = S.object()
  .prop('Authorization', S.string().required())

export default {
  body: schema,
  headers: headerSchema
}