import postgres from 'postgres'

const sql = postgres('postgres://postgres:postgres@postgres:5432/main') //TODO fill envs

export default sql