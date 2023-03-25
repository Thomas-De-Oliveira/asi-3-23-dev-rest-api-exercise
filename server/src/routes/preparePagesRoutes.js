import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import auth from "../middlewares/auth.js"
import { InvalidAccessError, NotFoundError } from "../error.js"
import {
  idValidator,
  limitValidator,
  pageValidator,
  slugValidator,
  contentValidator,
  titleValidator,
  statusValidator,
} from "../validators.js"
import PageModel from "../db/models/PageModel.js"

const preparePagesRoutes = ({ app, db }) => {
  app.get(
    "/pages/:slug",
    validate({
      params: {
        slug: slugValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        data: {
          params: { slug },
        },
        session: { user: sessionUser },
      } = req

      const query = PageModel.query().where({ slug: slug })
      const [countResult] = await query.clone().limit(1).offset(0).count()
      const count = Number.parseInt(countResult.count, 10)
      const page = await query

      let status
      page.map((p) => (status = p.status))

      if (status !== "published" && sessionUser === null) {
        throw new InvalidAccessError()
      }

      if (!page) {
        throw new NotFoundError()
      }

      res.send({
        result: page,
        meta: {
          count,
        },
      })
    })
  ),
    app.get(
      "/pages",
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

        const query = PageModel.query()
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

        const [countResult] = await query
          .clone()
          .clearSelect()
          .limit(1)
          .offset(0)
          .count()
        const count = Number.parseInt(countResult.count, 10)
        const pages = await query

        if (!pages) {
          throw new NotFoundError()
        }

        res.send({ result: pages, meta: { count } })
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

        const query = PageModel.query().where({ id: pageId })
        const [countResult] = await query.clone().limit(1).offset(0).count()
        const count = Number.parseInt(countResult.count, 10)
        const page = await query

        if (!page) {
          throw new NotFoundError()
        }

        res.send({ result: page, meta: { count } })
      })
    ),
    app.post(
      "/createPage",
      auth(["admin", "manager"]),
      validate({
        body: {
          title: titleValidator.required(),
          content: contentValidator.required(),
          slug: slugValidator.required(),
          status: statusValidator.required(),
          navId: idValidator.required(),
        },
      }),
      mw(async (req, res) => {
        const {
          data: {
            body: { title, content, slug, status, navId },
          },
          session: { user: sessionUser },
        } = req

        const page = await PageModel.query().findOne({ slug })

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

        res.send({ result: page, msg: "creation success" })
      })
    ),
    app.patch(
      "/page/:pageId",
      auth(["admin", "manager"]),
      validate({
        body: {
          title: titleValidator,
          content: contentValidator,
          slug: slugValidator,
          status: statusValidator,
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
          session: { user: sessionUser },
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

        const userId = sessionUser.id

        await db("rel_page_user").insert({
          pageId,
          userId,
        })

        if (navId) {
          await db("rel_nav_pages").where({ pageId: pageId }).update({
            navId: navId,
          })
        }

        res.send({ result: updatedPage, msg: "update success" })
      })
    ),
    app.patch(
      "/content/:pageId",
      validate({
        body: {
          content: contentValidator,
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
          session: { user: sessionUser },
        } = req

        const page = await PageModel.query().where({ id: pageId })

        if (!page) {
          throw new NotFoundError()
        }

        const updatedPage = await PageModel.query().updateAndFetchById(pageId, {
          ...(title ? { title } : {}),
          ...(content ? { content } : {}),
        })

        const userId = sessionUser.id

        await db("rel_page_user").insert({
          pageId,
          userId,
        })

        res.send({ result: updatedPage, msg: "update success" })
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

        await db("rel_nav_pages").delete().where({ pageId: pageId })
        await db("rel_page_user").delete().where({ pageId: pageId })

        await PageModel.query().deleteById(pageId)

        res.send({ result: page, msg: "page deleted" })
      })
    )
}

export default preparePagesRoutes
