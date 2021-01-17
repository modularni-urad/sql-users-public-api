import express from 'express'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import initDB from './db.js'
import initRoutes from './routes.js'

export async function init (mocks = null) {
  const knex = mocks ? await mocks.dbinit() : await initDB()
  const app = express()
  const appContext = { express, knex }

  app.use(initRoutes(appContext))

  initErrorHandlers(app) // ERROR HANDLING
  return app
}

if (process.env.NODE_ENV !== 'test') {
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3000
  init().then(app => {
    app.listen(port, host, (err) => {
      if (err) throw err
      console.log(`radagast rides his crew on ${host}:${port}`)
    })
  }).catch(err => {
    console.error(err)
  })
}
