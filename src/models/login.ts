import { Knex } from 'knex'

export class LoginModel {

  constructor () { }

  login(db: Knex, username: any, password: any) {
    return db('users')
      .select('id', 'first_name', 'last_name')
      .where('username', username)
      .where('password', password)
  }

}
