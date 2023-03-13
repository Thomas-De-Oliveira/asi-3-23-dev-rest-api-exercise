import RoleModel from "../db/models/RoleModel.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import { NotFoundError } from "../error.js"

const prepareRolesRoutes = ({ app }) => {
  app.get(
    "/roles",
    validate({}),
    mw(async (req, res) => {
      const roles = await RoleModel.query().select("roles.id", "roles.name")

      if (!roles) {
        throw new NotFoundError()
      }

      res.send({ result: roles })
    })
  )
}

export default prepareRolesRoutes
