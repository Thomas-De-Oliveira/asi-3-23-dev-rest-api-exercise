import express from "express"
import cors from "cors"
import config from "./src/config.js"
import morgan from "morgan"
import knex from "knex"
import BaseModel from "./src/db/models/BaseModel.js"
import prepareRoutes from "./src/prepareRoutes.js"
import handleError from "./src/middlewares/handleError.js"
import cookieParser from "cookie-parser"

const db = knex(config.db)

BaseModel.knex(db)

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())

prepareRoutes({ app, db })

app.use(handleError)
app.use((req, res) => {
  res.status(404).send({ error: [`cannot POST ${req.url}`] })
})

app.listen(config.port, () => console.log(`listening on port: ${config.port}`))
