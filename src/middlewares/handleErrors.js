import Objection from "objection"
import { send404, send500 } from "../utils/http.js"

const handleErrrors = async (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof Objection.NotFoundError) {
    send404(res, err.modelClass.name)

    return
  }

  if (err instanceof Objection.UniqueViolationError) {
    res.status(409).send({
      error: [`Duplicated value for "${err.columns.join('", "')}"`],
    })

    return
  }

  // eslint-disable-next-line no-console
  console.error(err)

  send500(res)
}

export default handleErrrors