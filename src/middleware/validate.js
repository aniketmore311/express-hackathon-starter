const { validationResult } = require('express-validator')
const createError = require('http-errors')

module.exports = function () {
  return function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = errors.array()[0]
      const message = `${error.param} ${error.msg}`
      // const err = new Error(message)
      const err = createError(400, message)
      next(err)
    }
    next()
  }
}
