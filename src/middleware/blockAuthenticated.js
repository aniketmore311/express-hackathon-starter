//@ts-check
const { isLoggedIn } = require('../utils')

module.exports = function () {
  return function (req, res, next) {
    if (isLoggedIn(req)) {
      res.redirect('/')
      return
    }
    next()
  }
}
