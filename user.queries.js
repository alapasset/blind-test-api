const Pool = require('pg').Pool

const pool = new Pool({
    user: 'ovsphfdxhwedif',
    host: 'ec2-54-246-90-10.eu-west-1.compute.amazonaws.com',
    database: 'db10qat7l73pcr',
    password: '4e21ec9c1a8655abf852a131865520e9d07c4ed05f22f9c015597895da14e51f',
    port: 5432,
})

const get = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const create = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}

const update = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const unactivate = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('UPDATE users SET activate = 0 WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User with ID: ${id} is unactivate`)
  })
}

module.exports = {
  get,
  getById,
  create,
  update,
  unactivate,
}