import hashPassword from "../db/hashPassword.js"
import UserModel from "../db/models/UserModel.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import auth from "../middlewares/auth.js"
import { sanitizeUser } from "../sanitizers.js"
import { NotFoundError, InvalidAccessError } from "../error.js"

import {
  emailValidator,
  passwordValidator,
  stringValidator,
  idValidator,
} from "../validators.js"

const prepareUsersRoutes = ({ app, db }) => {
  const checkIfUserExists = async (userId) => {
    const user = await UserModel.query().findById(userId)

    if (user) {
      return user
    }

    throw new NotFoundError()
  }

  app.post(
    "/:nameRole/createUser",
    validate({
      params: {
        nameRole: stringValidator,
      },
      body: {
        firstName: stringValidator.required(),
        lastName: stringValidator.required(),
        email: emailValidator.required(),
        password: passwordValidator.required(),
        roleId: idValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { nameRole } = req.data.params
      const { email, password, firstName, lastName, roleId } = req.data.body

      if (nameRole === "admin") {
        const user = await UserModel.query().findOne({ email })

        if (user) {
          res.send({ result: "OK" })

          return
        }

        const [passwordHash, passwordSalt] = await hashPassword(password)

        await db("users").insert({
          firstName,
          lastName,
          email,
          passwordHash,
          passwordSalt,
          roleId,
        })

        res.send({ result: "OK" })
      } else {
        res.send({ result: "You are not admin" })

        return
      }
    })
  )
  app.get(
    "/:nameRole/users",
    auth,
    validate({
      params: {
        nameRole: stringValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { nameRole } = req.data.params

      if (nameRole === "admin") {
        const users = await UserModel.query()
          .select(
            "users.id",
            "users.firstName",
            "users.lastName",
            "users.email",
            "roles.name as role"
          )
          .innerJoin("roles", "users.roleId", "roles.id")

        if (!users) {
          res.send({ result: "OK" })

          return
        }

        res.send({ result: users })
      } else {
        res.send({ result: "You are not admin" })

        return
      }
    })
  ),
    app.get(
      "/users/:userId",
      validate({
        params: {
          userId: idValidator.required(),
        },
      }),
      mw(async (req, res) => {
        const { userId } = req.data.params
        const user = await db("users")
          .where({ id: userId })
          .select(
            "users.id",
            "users.firstName",
            "users.lastName",
            "users.email",
            "users.roleId"
          )

        if (!user) {
          throw new NotFoundError()
        }

        res.send({ result: sanitizeUser(user) })
      })
    ),
    app.patch(
      "/users/:userId",
      auth,
      validate({
        params: { userId: idValidator.required() },
        body: {
          firstName: stringValidator,
          lastName: stringValidator,
          email: emailValidator,
          roleId: idValidator,
        },
      }),
      mw(async (req, res) => {
        const {
          data: {
            body: { firstName, lastName, email, roleId },
            params: { userId },
          },
          session: { user: sessionUser },
        } = req

        if (userId !== sessionUser.id && sessionUser.role !== "admin") {
          throw new InvalidAccessError()
        }

        const user = await checkIfUserExists(userId, res)

        if (!user) {
          return
        }

        const updatedUser = await UserModel.query().updateAndFetchById(userId, {
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
          ...(email ? { email } : {}),
          ...(roleId ? { roleId } : {}),
        })

        res.send({ result: sanitizeUser(updatedUser) })
      })
    ),
    app.delete(
      "/users/:userId",
      auth,
      validate({
        params: { userId: idValidator.required() },
      }),
      mw(async (req, res) => {
        const {
          data: {
            params: { userId },
          },
          session: { user: sessionUser },
        } = req

        if (sessionUser.role !== "admin") {
          throw new InvalidAccessError()
        }

        const user = await checkIfUserExists(userId, res)

        if (!user) {
          return
        }

        await UserModel.query().deleteById(userId)

        res.send("user deleted")
      })
    )
}

export default prepareUsersRoutes
