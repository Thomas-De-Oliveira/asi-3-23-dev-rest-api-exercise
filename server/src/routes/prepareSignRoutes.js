import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"
import { InvalidCredentialsError } from "../error.js"
import hashPassword from "../db/hashPassword.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import { emailValidator } from "../validators.js"

const prepareSignRoutes = ({ app, db }) => {
  app.post(
    "/sign-in",
    validate({
      body: {
        email: emailValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { email, password } = req.data.body
      const [user] = await db("users")
        .where({ email })
        .innerJoin("roles", "users.roleId", "roles.id")

      if (!user) {
        throw new InvalidCredentialsError()
      }

      const [passwordHash] = hashPassword(password, user.passwordSalt)

      if (user.passwordHash !== passwordHash) {
        throw new InvalidCredentialsError()
      }

      const jwt = jsonwebtoken.sign(
        {
          payload: {
            user: {
              id: user.id,
              role: user.name,
            },
          },
        },
        config.security.jwt.secret,
        { expiresIn: config.security.jwt.expiresIn }
      )

      res.send({ result: jwt })
    })
  )
}

export default prepareSignRoutes
