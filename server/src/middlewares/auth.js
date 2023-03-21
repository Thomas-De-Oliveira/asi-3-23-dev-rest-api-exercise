import { InvalidSessionError } from "../error.js"
import mw from "./mw.js"

const auth = (role) =>
  mw(async (req, res, next) => {
    const {
      session: { user: sessionUser },
    } = req

    if (!sessionUser.role === role || !role.includes(sessionUser.role)) {
      throw new InvalidSessionError()
    }

    next()
  })

export default auth
