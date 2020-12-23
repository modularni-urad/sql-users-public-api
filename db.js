import knex from 'knex'
import assert from 'assert'
assert.ok(process.env.DATABASE_URL, 'env.DATABASE_URL not defined!')

export default async () => {
  //
  const opts = {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    debug: process.env.NODE_ENV === 'debug'
  }

  const db = knex(opts)

  return new Promise(resolve => resolve(db))
}