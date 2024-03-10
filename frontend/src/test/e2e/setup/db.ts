import postgres from 'postgres'

const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'main',
  username: 'postgres',
  password: 'postgres',
})

export default sql