const Knex = require('knex')

module.exports = Knex({ client: 'pg', connection: process.env.DATABASE_URL })
