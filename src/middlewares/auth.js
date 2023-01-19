import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"
import hasAccess from "../utils/hasAccess.js"
import { send403 } from "../utils/http.js"

const auth = (role) => (req, res, next) => {
  const {
    headers: { authorization = "" },
  } = req

  const jwt = authorization.slice(7)

  try {
    const payload = jsonwebtoken.verify(jwt, config.security.jwt.secret)

    req.session = payload.session

    if (role) {
      hasAccess(req.session, role)
    }

    next()
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      send403(res)

      return
    }

    throw err
  }
}

export default auth