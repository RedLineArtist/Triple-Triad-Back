import { pbkdf2Sync, randomBytes } from "crypto"
import config from "./config.js"

const hashPassword = (
  password,
  salt = randomBytes(128).toString("hex"),
  iterations = config.security.password.iterations,
  keylen = config.security.password.keylen,
  digest = config.security.password.digest,
  pepper = config.security.password.pepper
) => [
  pbkdf2Sync(`${pepper}${password}`, salt, iterations, keylen, digest).toString("hex"),
  salt,
]

export default hashPassword
