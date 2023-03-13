import "dotenv/config"

export default {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  migrations: {
    directory: "./src/db/migrations",
    stub: "./src/db/migration.stub",
  },
  seeds: {
    directory: "./src/db/seeds",
  },
}
