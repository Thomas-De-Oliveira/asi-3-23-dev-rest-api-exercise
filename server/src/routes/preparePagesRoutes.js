import RelNavPageModel from "../db/models/RelNavPageModel.js"
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
import PageModel from "../db/models/PageModel.js"

const preparePagesRoutes = ({ app, db }) => {
  app.get(
    "/pages/:slug",
    validate({
      params: {
        slug: stringValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        data: {
          params: { slug },
        },
      } = req

      const page = await PageModel.query().where({ slug: slug })

      if (!page) {
        throw new NotFoundError()
      }

      res.send({ result: page })
    })
  ),
    app.get(
      "/pages",
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

        const pages = PageModel.query()
          .innerJoin("users", "pages.creator", "=", "users.id")
          .select(
            "pages.id",
            "pages.title",
            "pages.content",
            "pages.slug",
            "pages.status",
            "users.firstName"
          )
          .modify("paginate", limit, page)

        if (!pages) {
          throw new NotFoundError()
        }

        res.send({ result: pages })
      })
    ),
    app.get(
      "/page/:pageId",
      auth(["admin", "manager"]),
      validate({
        params: {
          pageId: idValidator.required(),
        },
      }),
      mw(async (req, res) => {
        const {
          data: {
            params: { pageId },
          },
        } = req

        const page = await PageModel.query().where({ id: pageId })

        if (!page) {
          throw new NotFoundError()
        }

        res.send({ result: page })
      })
    ),
    app.post(
      "/createPage",
      auth(["admin", "manager"]),
      validate({
        body: {
          title: stringValidator,
          content: stringValidator,
          slug: stringValidator,
          status: stringValidator,
          navId: idValidator,
        },
      }),
      mw(async (req, res) => {
        const {
          data: {
            body: { title, content, slug, status, navId },
          },
          session: { user: sessionUser },
        } = req

        const page = await PageModel.query().findOne({ title })

        if (page) {
          throw new NotFoundError()
        }

        const creator = sessionUser.id

        await db("pages").insert({
          title,
          content,
          slug,
          status,
          creator,
        })

        let pageId = await PageModel.query()
          .select("pages.id")
          .where({ slug: slug })

        pageId.map((p) => (pageId = p.id))

        await db("rel_nav_pages").insert({
          pageId,
          navId,
        })

        res.send({ result: page })
      })
    ),
    app.patch(
      "/page/:pageId",
      auth(["admin", "manager"]),
      validate({
        body: {
          title: stringValidator,
          content: stringValidator,
          slug: stringValidator,
          status: stringValidator,
          navId: idValidator,
        },
        params: {
          pageId: idValidator.required(),
        },
      }),
      mw(async (req, res) => {
        const {
          data: {
            body: { title, content, slug, status, navId },
            params: { pageId },
          },
        } = req

        const page = await PageModel.query().where({ id: pageId })

        if (!page) {
          throw new NotFoundError()
        }

        const updatedPage = await PageModel.query().updateAndFetchById(pageId, {
          ...(title ? { title } : {}),
          ...(content ? { content } : {}),
          ...(slug ? { slug } : {}),
          ...(status ? { status } : {}),
        })

        await RelNavPageModel.query()
          .updateAndFetch({
            ...(navId ? { navId } : {}),
          })
          .where({ pageId: pageId })

        res.send({ result: updatedPage })
      })
    ),
    app.patch(
      "/content/:pageId",
      validate({
        body: {
          title: stringValidator,
          content: stringValidator,
        },
        params: {
          pageId: idValidator.required(),
        },
      }),
      mw(async (req, res) => {
        const {
          data: {
            body: { title, content },
            params: { pageId },
          },
        } = req

        const page = await PageModel.query().where({ id: pageId })

        if (!page) {
          throw new NotFoundError()
        }

        const updatedPage = await PageModel.query().updateAndFetchById(pageId, {
          ...(title ? { title } : {}),
          ...(content ? { content } : {}),
        })

        res.send({ result: updatedPage })
      })
    ),
    app.delete(
      "/page/:pageId",
      auth(["admin", "manager"]),
      validate({
        params: { pageId: idValidator.required() },
      }),
      mw(async (req, res) => {
        const {
          data: {
            params: { pageId },
          },
        } = req

        const page = await PageModel.query().where({ id: pageId })

        if (!page) {
          throw new NotFoundError()
        }

        await RelNavPageModel.query().delete().where({ pageId: pageId })

        await PageModel.query().deleteById(pageId)

        res.send("page deleted")
      })
    )
}

export default preparePagesRoutes
