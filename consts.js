export const TNAMES = {
  USERS: 'users'
}

export function createPwdHash (pwd) {
  return process.env.HASH_FUNC
    ? eval(process.env.HASH_FUNC.replace('<PWD>', pwd))
    : require('crypto').createHash('sha256').update(pwd).digest('base64')
}