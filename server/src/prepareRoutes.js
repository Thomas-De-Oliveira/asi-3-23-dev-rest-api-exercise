import prepareRolesRoutes from "./routes/prepareRolesRoutes.js"
import prepareSignRoutes from "./routes/prepareSignRoutes.js"
import prepareUsersRoutes from "./routes/prepareUsersRoutes.js"
import prepareNavRoutes from "./routes/prepareNavRoutes.js"
import preparePagesRoutes from "./routes/preparePagesRoutes.js"


const prepareRoutes = (ctx) => {
  prepareSignRoutes(ctx)
  prepareUsersRoutes(ctx)
  prepareRolesRoutes(ctx)
  prepareNavRoutes(ctx)
  preparePagesRoutes(ctx)
}

export default prepareRoutes
