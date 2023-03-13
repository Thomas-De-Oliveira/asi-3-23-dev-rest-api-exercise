import { pbkdf2Sync, randomBytes } from "node:crypto"
import config from "../config.js"

const security = config.security.password

const hashPassword = (
  password,
  salt = randomBytes(security.saltlen).toString("hex")
) => [
  pbkdf2Sync(
    `${password}${config.security.password.pepper}`,
    salt,
    security.iterations,
    security.keylen,
    security.digest
  ).toString("hex"),
  salt,
]

export default hashPassword
