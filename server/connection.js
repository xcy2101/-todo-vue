const mysql = require('mysql')

const options = {
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'test'
}

const connection = mysql.createConnection(options)

connection.connect()

module.exports = connection
