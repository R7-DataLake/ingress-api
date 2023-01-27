import S from 'fluent-json-schema'

const chronicSchema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('hospcode', S.string().minLength(5).maxLength(5).required())
    .prop('hn', S.string().maxLength(50).required())
    .prop('dateServ', S.string().maxLength(8).minLength(8).required())
    .prop('chronic', S.string().maxLength(8).minLength(3).required())
    .prop('hospDx', S.string().minLength(5).maxLength(5).required())
    .prop('hospRx', S.string().minLength(5).maxLength(5).required())
    .prop('dUpdate', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: chronicSchema
}