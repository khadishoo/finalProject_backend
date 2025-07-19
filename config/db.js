const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: 5432,
    password: 'admin',
    database: 'finalproject_db'
})

module.exports = pool 