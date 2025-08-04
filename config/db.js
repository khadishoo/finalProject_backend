const {Pool} = require('pg')

const pool = new Pool({
    connectionString: 'postgresql://khadisha:fqwowbHIwXuOQ6HEVhXsXlKkpkAw8VJi@dpg-d28bgobipnbc739ig2dg-a.oregon-postgres.render.com/finalproject_db_tj8y',
    ssl: {rejectUnauthorized: false}
})

module.exports = pool 