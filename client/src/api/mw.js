import { AppError } from "@/api/error.js"

export const handle404 = (req, res) =>
  res.status(404).send({ error: ["Not found"], code: "errors.notFound" })

const mw = (handlers) => async (req, res) => {
  const { method } = req
  const handler = handlers[method]

  if (!handler) {
    handle404(req, res)

    return
  }

  const mws = Array.isArray(handler) ? handler : [handler]
  let mwIndex = -1
  const next = async () => {
    mwIndex += 1

    try {
      await mws[mwIndex](req, res, next)
    } catch (err) {
      if (!(err instanceof AppError)) {
        // eslint-disable-next-line no-console
        console.error(err)

        res
          .status(500)
          .send({ error: ["Oops. Something went wrong."], errorCode: "error" })

        return
      }

      res.status(err.httpCode).send({ error: err.errors, code: err.code })
    }
  }

  await next()
}

export default mw
