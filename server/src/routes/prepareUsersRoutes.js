import hashPassword from "../db/hashPassword.js"
import UserModel from "../db/models/UserModel.js"
import validate from "../middlewares/validate.js"
import {
  emailValidator,
  passwordValidator,
  stringValidator,
} from "../validators.js"

const prepareUsersRoutes = ({ app, db }) => {
  app.post(
    "/createUsers",
    validate({
      query: {
        nameRole: stringValidator,
      },
      body: {
        email: emailValidator.required(),
        password: passwordValidator.required(),
      },
    }),
    async (req, res) => {
      const { nameRole } = req.locals.query
      const { email, password } = req.locals.body

      if (nameRole === "admin") {
        const user = await UserModel.query().findOne({ email })

        if (user) {
          res.send({ result: "OK" })

          return
        }

        const [passwordHash, passwordSalt] = await hashPassword(password)

        await db("users").insert({
          email,
          passwordHash,
          passwordSalt,
        })

        res.send({ result: "OK" })
      } else {
        res.send({ result: "You are not admin" })

        return
      }
    }
  )
}

export default prepareUsersRoutes
