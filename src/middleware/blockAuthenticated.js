/**
 * @returns {import('express').RequestHandler}
 */
module.exports = function () {
  return function (req, res, next) {
    const user = req.session.user
    if (user) {
      res.redirect('/')
      return
    }
    next()
  }
}
