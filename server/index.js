import express from "express"
import cors from "cors"
import config from "./src/config.js"
import morgan from "morgan"
import knex from "knex"
import BaseModel from "./src/db/models/BaseModel.js"
import prepareRoutes from "./src/prepareRoutes.js"

const db = knex(config.db)

BaseModel.knex(db)

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(config.logger.format))
app.use((req, res, next) => {
  req.locals = {}

  next()
})

prepareRoutes({ app, db })

app.listen(config.port, () => console.log(`listening on port: ${config.port}`))
