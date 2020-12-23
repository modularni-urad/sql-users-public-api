import { TNAMES, createPwdHash } from './consts.js'
import bodyParser from 'body-parser'

export default (ctx) => {
  const { knex, express } = ctx
  const app = express()

  app.post('/login', bodyParser.json(), (req, res, next) => {
    let { password, username } = req.body
    password = createPwdHash(password)
    knex(TNAMES.USERS).where({ username, password }).select(publicParams)
      .then(rs => {
        const user = rs.length > 0 ? rs[0] : null
        if (!user) return next(401)
        req.session.user = user // save to session (thus cookie set, ...)
        res.json(user)
      })
      .catch(next)
  })

  app.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      return err ? next(err) : res.send('ok')
    })
  })

  const publicParams = [ 'id', 'username', 'name', 'email' ]

  app.get('/uinfo/:uid', (req, res, next) => {
    const uids = req.params.uid.split(',')
    knex(TNAMES.USERS).whereIn('id', uids).select(publicParams)
      .then(rs => res.json(rs))
      .catch(next)
  })

  // app.get('/profiles', (req, res, next) => {
  //   // vrati pary (uid: jmeno) na zaklade queryparam q
  //   res.json(findProfiles(req.query.q))
  // })

  return app
}
