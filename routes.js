import { TNAMES, createPwdHash } from './consts.js'
import bodyParser from 'body-parser'
import axios from 'axios'
const SESSION_SVC = process.env.SESSION_SERVICE || 'http://session-svc'
const COOKIE_NAME = 'Bearer'

export default (ctx) => {
  const { knex, express } = ctx
  const app = express()

  app.post('/login', bodyParser.json(), (req, res, next) => {
    let { password, username } = req.body
    let user = null
    password = createPwdHash(password)

    knex(TNAMES.USERS).where({ username, password }).select(publicParams)
      .then(rs => {
        user = rs.length > 0 ? rs[0] : null
        if (!user) return next(401)
        return axios.post(`${SESSION_SVC}/sign`, user)
      })
      .then(r => {
        res.cookie(COOKIE_NAME, r.data.token, {
          maxAge: 24 * 60 * 60,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        })
        res.json(user)
      })
      .catch(next)
  })

  app.post('/logout', (req, res, next) => {
    return axios.post(`${SESSION_SVC}/logout`).then(r => {
      res.clearCookie(COOKIE_NAME)
      res.send('ok')
    }).catch(next)
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
