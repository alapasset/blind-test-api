const { Pool } = require('pg')

const DB_INFOS = {
  host: "ec2-54-246-90-10.eu-west-1.compute.amazonaws.com",
  user: "ovsphfdxhwedif",
  port: 5432,
  ssl: { rejectUnauthorized: false },
  database: "db10qat7l73pcr",
  password: "4e21ec9c1a8655abf852a131865520e9d07c4ed05f22f9c015597895da14e51f"
}

const pool = new Pool(DB_INFOS)

module.exports = {
    query: (text, params) => pool.query(text, params),
}