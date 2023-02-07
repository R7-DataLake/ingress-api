import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('hospcode', S.string().minLength(5).maxLength(10).required())
    .prop('hn', S.string().maxLength(50).required())
    .prop('an', S.string().maxLength(15).required())
    .prop('dateadm', S.string().maxLength(8).minLength(8).required())
    .prop('timeadm', S.string().maxLength(4).minLength(4).required())
    .prop('datedsc', S.string().maxLength(8).minLength(8).required())
    .prop('timedsc', S.string().maxLength(4).minLength(4).required())
    .prop('dischs', S.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9']).required())
    .prop('discht', S.enum(['1', '2', '3', '4', '5', '8', '9']).required())
    .prop('dept', S.string().maxLength(6).required())
    .prop('warddsc', S.string().maxLength(6))
    .prop('admW', S.number().default(0))
    .prop('dUpdate', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: schema
}