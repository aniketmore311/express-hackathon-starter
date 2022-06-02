//@ts-check
const { validationResult } = require('express-validator')

module.exports = function (req) {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return null
  } else {
    const error = errors.array()[0]
    const message = error.param + ' ' + error.msg
    return message
  }
}
