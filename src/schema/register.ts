import S from 'fluent-json-schema'

const registerSchema = S.object()
  .prop('username', S.string().minLength(4).required())
  .prop('password', S.string().minLength(8).required())
  .prop('firstName', S.string())
  .prop('lastName', S.string())
  .prop('sex', S.enum(['M', 'F']).required())

export default {
  body: registerSchema
}