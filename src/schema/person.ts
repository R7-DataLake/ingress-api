import S from 'fluent-json-schema'

const schema = S.array().minItems(1).maxItems(100).items(
  S.object()
    .prop('HOSPCODE', S.string().minLength(5).maxLength(10).required())
    .prop('HN', S.string().maxLength(50).required())
    .prop('CID', S.string().maxLength(13).minLength(13).required())
    .prop('TITLE', S.string().maxLength(30).required())
    .prop('FNAME', S.string().maxLength(100).required())
    .prop('LNAME', S.string().maxLength(100).required())
    .prop('BIRTH', S.string().minLength(8).maxLength(8).required())
    .prop('SEX', S.enum(['1', '2']).required())
    .prop('MARRIAGE', S.enum(['1', '2', '3', '4', '5', '6', '9']).required())
    .prop('OCCUPATION', S.string().required())
    .prop('NATION', S.string().required())
    .prop('IDTYPE', S.enum(['1', '2', '3', '4', '5']).required())
    .prop('CHANGWAT', S.string().maxLength(2).minLength(2).required())
    .prop('AMPHUR', S.string().maxLength(2).minLength(2).required())
    .prop('TAMBOL', S.string().maxLength(2).required())
    .prop('MOO', S.string().maxLength(3).required())
    .prop('TYPEAREA', S.enum(['1', '2', '3', '4', '5']).required())
    .prop('D_UPDATE', S.string().maxLength(14).minLength(14).required())
)

const headerSchema = S.object()
  .prop('Authorization', S.string().required())

export default {
  body: schema,
  headers: headerSchema
}