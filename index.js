import express from "express"
import cors from "cors"
import config from "./src/config.js"
import morgan from "morgan"

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(config.logger.format))

app.listen(config.port, () => console.log(`listening on port: ${config.port}`))
