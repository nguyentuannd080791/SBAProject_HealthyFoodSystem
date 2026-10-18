import jsonServer from 'json-server'
import { errorHandler, notFoundHandler } from './errors/errorHandlers.js'
import { createAuthenticate } from './middleware/authenticate.js'
import { createReloadDatabase } from './middleware/reloadDatabase.js'
import { createRepositories } from './repositories/createRepositories.js'
import { registerAdminRoutes } from './routes/adminRoutes.js'
import { registerAddressRoutes } from './routes/addressRoutes.js'
import { registerAuthRoutes } from './routes/authRoutes.js'
import { registerProfileRoutes } from './routes/profileRoutes.js'
import { createServices } from './services/createServices.js'

export function createApp(source, { logger = false, reload = false } = {}) {
  const db = jsonServer.router(source).db
  const services = createServices(createRepositories(db))
  const authenticate = createAuthenticate(services.session)
  const app = jsonServer.create()

  app.use(jsonServer.defaults({ logger }))
  app.use(jsonServer.bodyParser)
  if (reload) app.use(createReloadDatabase(db))
  registerAuthRoutes(app, services, authenticate)
  registerProfileRoutes(app, services, authenticate)
  registerAddressRoutes(app, services, authenticate)
  registerAdminRoutes(app, services, authenticate)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return { app, db }
}
