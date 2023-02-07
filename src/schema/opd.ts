import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('hospcode', S.string().minLength(5).maxLength(10).required())
    .prop('hn', S.string().maxLength(50).required())
    .prop('clinic', S.string().maxLength(10).required())
    .prop('dateServ', S.string().maxLength(8).minLength(8).required())
    .prop('timeServ', S.string().maxLength(6).minLength(6).required())
    .prop('seq', S.string().maxLength(15).required())
    .prop('chiefcomp', S.string().maxLength(255).required())
    .prop('btemp', S.number().maximum(100).required())
    .prop('sbp', S.number().minimum(40).maximum(200).required())
    .prop('dbp', S.number().minimum(40).maximum(200).required())
    .prop('pr', S.number().minimum(10).maximum(200).required())
    .prop('rr', S.number().minimum(10).maximum(200).required())
    .prop('typein', S.enum(['1', '2', '3', '4']).required())
    .prop('typeout', S.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9']).required())
    .prop('insType', S.string().maxLength(10).required())
    .prop('insNumber', S.string().maxLength(15))
    .prop('insHospmain', S.string().maxLength(10).minLength(5))
    .prop('insHospsub', S.string().maxLength(10).minLength(5))
    .prop('diagText', S.string().maxLength(255))
    .prop('dUpdate', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: schema
}