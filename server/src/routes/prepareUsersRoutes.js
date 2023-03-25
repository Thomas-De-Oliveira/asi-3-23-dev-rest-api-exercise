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
  idValidator,
  pageValidator,
  limitValidator,
  firstNameValidator,
  lastNameValidator,
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
    "/createUser",
    auth("admin"),
    validate({
      body: {
        firstName: firstNameValidator.required(),
        lastName: lastNameValidator.required(),
        email: emailValidator.required(),
        password: passwordValidator.required(),
        roleId: idValidator.required(),
      },
    }),
    mw(async (req, res) => {
      const { email, password, firstName, lastName, roleId } = req.data.body

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
    })
  )
  app.get(
    "/users",
    auth("admin"),
    validate({
      query: {
        limit: limitValidator,
        page: pageValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        data: {
          query: { limit, page },
        },
      } = req
      const query = UserModel.query()
        .select(
          "users.id",
          "users.firstName",
          "users.lastName",
          "users.email",
          "roles.name as role"
        )
        .modify("paginate", limit, page)

      const [countResult] = await query
        .clone()
        .clearSelect()
        .limit(1)
        .offset(0)
        .count()
      const count = Number.parseInt(countResult.count, 10)
      const users = await query.innerJoin("roles", "users.roleId", "roles.id")

      if (!users) {
        res.send({ result: users })

        return
      }

      res.send({ result: users, meta: { count } })
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
        const {
          session: { user: sessionUser },
        } = req

        if (userId !== sessionUser.id && sessionUser.role !== "admin") {
          throw new InvalidAccessError()
        }

        const query = UserModel.query()
          .select(
            "users.id",
            "users.firstName",
            "users.lastName",
            "users.email",
            "users.roleId"
          )
          .where({ id: userId })
        const [countResult] = await query
          .clone()
          .clearSelect()
          .limit(1)
          .offset(0)
          .count()
        const count = Number.parseInt(countResult.count, 10)
        const user = await query

        if (!user) {
          throw new NotFoundError()
        }

        res.send({ result: sanitizeUser(user), meta: { count } })
      })
    ),
    app.patch(
      "/users/:userId",
      auth(["admin", "editor", "manager"]),
      validate({
        params: { userId: idValidator.required() },
        body: {
          firstName: firstNameValidator,
          lastName: lastNameValidator,
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

        res.send({ result: sanitizeUser(updatedUser), msg: "update success" })
      })
    ),
    app.delete(
      "/users/:userId",
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

        if (userId !== sessionUser.id && sessionUser.role !== "admin") {
          throw new InvalidAccessError()
        }

        const user = await checkIfUserExists(userId, res)

        if (!user) {
          return
        }

        await db("pages").update({ creator: null }).where({ creator: userId })
        await db("rel_page_user").delete().where({ userId: userId })

        await UserModel.query().deleteById(userId)

        res.send("user deleted")
      })
    )
}

export default prepareUsersRoutes
