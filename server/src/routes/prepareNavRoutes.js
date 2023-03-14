import NavigationModel from "../db/models/NavigationModel.js"
import RelNavPageModel from "../db/models/RelNavPageModel.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import auth from "../middlewares/auth.js"
import { NotFoundError, InvalidAccessError } from "../error.js"
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
        offset: pageValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        data: {
          query: { limit, offset },
        },
      } = req

      const navigation = await NavigationModel.query()
        .select("navigation.name", "pages.title", "pages.slug")
        .innerJoin("rel_nav_pages", "navigation.id", "rel_nav_pages.navId")
        .innerJoin("pages", "rel_nav_pages.pageId", "pages.id")
        .orderBy("navigation.name")
        .limit(limit)
        .offset(offset)

      if (!navigation) {
        throw new NotFoundError()
      }

      const tableNav = []
      navigation.map((nav) =>
        tableNav.filter((table) => table.name === nav.name).length > 0
          ? tableNav.map((table) =>
              table.name === nav.name
                ? table.pages.push({
                    title: nav.title,
                    slug: nav.slug,
                  })
                : ""
            )
          : tableNav.push({
              name: nav.name,
              pages: [{ title: nav.title, slug: nav.slug }],
            })
      )

      res.send({ result: tableNav })
    })
  ),
    app.get(
      "/navigation",
      validate({
        query: {
          limit: limitValidator,
          offset: pageValidator,
        },
      }),
      mw(async (req, res) => {
        const {
          data: {
            query: { limit, offset },
          },
        } = req
        const navigation = await NavigationModel.query()
          .limit(limit)
          .offset(offset)

        if (!navigation) {
          throw new NotFoundError()
        }

        res.send({ result: navigation })
      })
    ),
    app.get(
      "/nav/:navId",
      auth,
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
          session: { user: sessionUser },
        } = req

        if (sessionUser.role === "editor") {
          throw new InvalidAccessError()
        }

        const navigation = await NavigationModel.query().where({ id: navId })

        if (!navigation) {
          throw new NotFoundError()
        }

        res.send({ result: navigation })
      })
    ),
    app.post(
      "/createNav",
      auth,
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
          session: { user: sessionUser },
        } = req

        if (sessionUser.role === "editor") {
          throw new InvalidAccessError()
        }

        const navigation = await NavigationModel.query().findOne({ name })

        if (navigation) {
          throw new NotFoundError()
        }

        await db("navigation").insert({
          name,
        })

        res.send({ result: navigation })
      })
    ),
    app.patch(
      "/nav/:navId",
      auth,
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
          session: { user: sessionUser },
        } = req

        if (sessionUser.role === "editor") {
          throw new InvalidAccessError()
        }

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

        res.send({ result: updatedNav })
      })
    ),
    app.delete(
      "/nav/:navId",
      auth,
      validate({
        params: { navId: idValidator.required() },
      }),
      mw(async (req, res) => {
        const {
          data: {
            params: { navId },
          },
          session: { user: sessionUser },
        } = req

        if (sessionUser.role === "editor") {
          throw new InvalidAccessError()
        }

        const navigation = await NavigationModel.query().where({ id: navId })

        if (!navigation) {
          throw new NotFoundError()
        }

        await RelNavPageModel.query().delete().where({ navId: navId })

        await NavigationModel.query().deleteById(navId)

        res.send("nav deleted")
      })
    )
}

export default prepareNavRoutes
