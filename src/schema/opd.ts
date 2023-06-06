import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(500).items(
  S.object()
    .prop('HOSPCODE', S.string().maxLength(10).required())
    .prop('HN', S.string().maxLength(50).required())
    .prop('CLINIC', S.string().maxLength(10).required())
    .prop('DATE_SERV', S.string().maxLength(8).minLength(8).required())
    .prop('TIME_SERV', S.string().maxLength(6).minLength(6).required())
    .prop('SEQ', S.string().maxLength(15).required())
    .prop('CHIEFCOMP', S.string().maxLength(1024).required())
    .prop('BTEMP', S.number().maximum(999))
    .prop('SBP', S.number().maximum(999))
    .prop('DBP', S.number().maximum(999))
    .prop('PR', S.number().maximum(999))
    .prop('RR', S.number().maximum(999))
    .prop('HEIGHT', S.number().maximum(999))
    .prop('WEIGHT', S.number().maximum(999))
    .prop('TYPEIN', S.string().maxLength(50).required())
    .prop('TYPEOUT', S.string().maxLength(50).required())
    .prop('INS_TYPE', S.string().maxLength(50).required())
    .prop('INS_NUMBER', S.string().maxLength(50))
    .prop('INS_HOSPMAIN', S.string().maxLength(10))
    .prop('INS_HOSPSUB', S.string().maxLength(10))
    .prop('DIAG_TEXT', S.string().maxLength(255))
    .prop('D_UPDATE', S.string().maxLength(14).minLength(14).required())
)

const headerSchema = S.object()
  .prop('Authorization', S.string().required())

export default {
  body: schema,
  headers: headerSchema
}