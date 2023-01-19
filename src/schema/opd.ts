import S from 'fluent-json-schema'

const opdSchema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('HOSPCODE', S.string().minLength(5).maxLength(5).required())
    .prop('HN', S.string().maxLength(50).required())
    .prop('CLINIC', S.string().maxLength(10).required())
    .prop('DATE_SERV', S.string().maxLength(8).minLength(8).required())
    .prop('TIME_SERV', S.string().maxLength(6).minLength(6).required())
    .prop('SEQ', S.string().maxLength(15).required())
    .prop('CHIEFCOMP', S.string().maxLength(255).required())
    .prop('BTEMP', S.number().maximum(100).required())
    .prop('SBP', S.number().minimum(40).maximum(200).required())
    .prop('DBP', S.number().minimum(40).maximum(200).required())
    .prop('PR', S.number().minimum(10).maximum(200).required())
    .prop('RR', S.number().minimum(10).maximum(200).required())
    .prop('TYPEIN', S.enum(['1', '2', '3', '4']).required())
    .prop('TYPEOUT', S.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9']).required())
    .prop('INS_TYPE', S.string().maxLength(10).required())
    .prop('INS_NUMBER', S.string().maxLength(15))
    .prop('INS_HOSPMAIN', S.string().maxLength(5).minLength(5))
    .prop('INS_HOSPSUB', S.string().maxLength(5).minLength(5))
    .prop('DIAG_TEXT', S.string().maxLength(255))
    .prop('D_UPDATE', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: opdSchema
}