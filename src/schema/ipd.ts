import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('HOSPCODE', S.string().minLength(5).maxLength(10).required())
    .prop('HN', S.string().maxLength(50).required())
    .prop('AN', S.string().maxLength(15).required())
    .prop('DATEADM', S.string().maxLength(8).minLength(8).required())
    .prop('TIMEADM', S.string().maxLength(4).minLength(4).required())
    .prop('DATEDSC', S.string().maxLength(8).minLength(8).required())
    .prop('TIMEDSC', S.string().maxLength(4).minLength(4).required())
    .prop('DISCHS', S.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9']).required())
    .prop('DISCHT', S.enum(['1', '2', '3', '4', '5', '8', '9']).required())
    .prop('DEPT', S.string().maxLength(6).required())
    .prop('WARDDSC', S.string().maxLength(6))
    .prop('ADM_W', S.number().default(0))
    .prop('D_UPDATE', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: schema
}