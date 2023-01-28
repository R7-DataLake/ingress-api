import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('hospcode', S.string().minLength(5).maxLength(5).required())
    .prop('hn', S.string().maxLength(50).required())
    .prop('cid', S.string().maxLength(13).minLength(13).required())
    .prop('title', S.string().maxLength(30).required())
    .prop('fname', S.string().maxLength(100).required())
    .prop('lname', S.string().maxLength(100).required())
    .prop('birth', S.string().minLength(8).maxLength(8).required())
    .prop('sex', S.enum(['1', '2']).required())
    .prop('marriage', S.enum(['1', '2', '3', '4', '5', '6', '9']).required())
    .prop('occupation', S.string().required())
    .prop('nation', S.string().required())
    .prop('idtype', S.enum(['1', '2', '3', '4', '5']).required())
    .prop('changwat', S.string().maxLength(2).minLength(2).required())
    .prop('amphur', S.string().maxLength(2).minLength(2).required())
    .prop('tambol', S.string().maxLength(2).required())
    .prop('moo', S.string().maxLength(3).required())
    .prop('typearea', S.enum(['1', '2', '3', '4', '5']).required())
    .prop('dUpdate', S.string().maxLength(14).minLength(14).required())
)

export default {
  body: schema
}