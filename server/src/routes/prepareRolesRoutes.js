import RoleModel from "../db/models/RoleModel.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import { NotFoundError } from "../error.js"

const prepareRolesRoutes = ({ app }) => {
  app.get(
    "/roles",
    validate({}),
    mw(async (req, res) => {
      const query = RoleModel.query().select("roles.id", "roles.name")
      const [countResult] = await query
        .clone()
        .clearSelect()
        .limit(1)
        .offset(0)
        .count()
      const count = Number.parseInt(countResult.count, 10)
      const roles = await query

      if (!roles) {
        throw new NotFoundError()
      }

      res.send({ result: roles, meta: { count } })
    })
  )
}

export default prepareRolesRoutes
