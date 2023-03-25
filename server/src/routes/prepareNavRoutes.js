import NavigationModel from "../db/models/NavigationModel.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import auth from "../middlewares/auth.js"
import { NotFoundError } from "../error.js"
import {
  stringValidator,
  idValidator,
  limitValidator,
  pageValidator,
} from "../validators.js"

const prepareNavRoutes = ({ app, db }) => {
  app.get(
    "/navigationPages",
    validate({
      query: {
        limit: limitValidator,
        page: pageValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        query: { limit, page },
        session: { user: sessionUser },
      } = req

      const query = NavigationModel.query().orderBy("navigation.name")
      const [countResult] = await query
        .skipUndefined()
        .clone()
        .clearOrder()
        .limit(1)
        .offset(0)
        .count()
      const count = Number.parseInt(countResult.count, 10)

      const navigation =
        sessionUser === null
          ? await query.withGraphJoined("pages").where({ status: "published" })
          : await query.withGraphJoined("pages").modify("paginate", limit, page)

      if (!navigation) {
        throw new NotFoundError()
      }

      res.send({ result: navigation, meta: { count } })
    })
  ),
    app.get(
      "/navigation",
      auth(["admin", "manager"]),
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

        const query = NavigationModel.query().modify("paginate", limit, page)
        const [countResult] = await query.clone().limit(1).offset(0).count()
        const count = Number.parseInt(countResult.count, 10)
        const navigation = await query

        if (!navigation) {
          throw new NotFoundError()
        }

        res.send({ result: navigation, meta: { count } })
      })
    ),
    app.get(
      "/nav/:navId",
      auth(["admin", "manager"]),
      validate({
        params: {
          navId: idValidator.required(),
        },
      }),
      mw(async (req, res) => {
        const {
          data: {
            params: { navId },
          },
        } = req

        const query = NavigationModel.query().where({ id: navId })
        const [countResult] = await query.clone().limit(1).offset(0).count()
        const count = Number.parseInt(countResult.count, 10)
        const navigation = await query

        if (!navigation) {
          throw new NotFoundError()
        }

        res.send({ result: navigation, meta: { count } })
      })
    ),
    app.post(
      "/createNav",
      auth(["admin", "manager"]),
      validate({
        body: {
          name: stringValidator,
        },
      }),
      mw(async (req, res) => {
        const {
          data: {
            body: { name },
          },
        } = req

        const navigation = await NavigationModel.query().findOne({ name })

        if (navigation) {
          throw new NotFoundError()
        }

        await db("navigation").insert({
          name,
        })

        res.send({ result: navigation, msg: "create success" })
      })
    ),
    app.patch(
      "/nav/:navId",
      auth(["admin", "manager"]),
      validate({
        body: {
          name: stringValidator,
        },
        params: {
          navId: idValidator.required(),
        },
      }),
      mw(async (req, res) => {
        const {
          data: {
            body: { name },
            params: { navId },
          },
        } = req

        const navigation = await NavigationModel.query().where({ id: navId })

        if (!navigation) {
          throw new NotFoundError()
        }

        const updatedNav = await NavigationModel.query().updateAndFetchById(
          navId,
          {
            ...(name ? { name } : {}),
          }
        )

        res.send({ result: updatedNav, msg: "update success" })
      })
    ),
    app.delete(
      "/nav/:navId",
      auth(["admin", "manager"]),
      validate({
        params: { navId: idValidator.required() },
      }),
      mw(async (req, res) => {
        const {
          data: {
            params: { navId },
          },
        } = req

        const navigation = await NavigationModel.query().where({ id: navId })

        if (!navigation) {
          throw new NotFoundError()
        }

        await db("rel_nav_pages").delete().where({ navId: navId })

        await NavigationModel.query().deleteById(navId)

        res.send({ result: navigation, msg: "nav deleted" })
      })
    )
}

export default prepareNavRoutes
