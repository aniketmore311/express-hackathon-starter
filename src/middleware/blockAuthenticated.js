/**
 * @returns {import('express').RequestHandler}
 */
module.exports = function () {
  return function (req, res, next) {
    const userId = req.session.userId
    if (userId) {
      res.redirect('/')
      return
    }
    next()
  }
}
