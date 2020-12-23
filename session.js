import session from 'express-session'
import redis from 'redis'

const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient(process.env.REDIS_URL)

export default session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: process.env.NODE_ENV === 'production'
  }
})