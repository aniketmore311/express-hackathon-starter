/**
 * @returns {import('express').RequestHandler}
 */
module.exports = function () {
  return function (req, res, next) {
    const user = req.session.user
    if (!user) {
      req.flash('errorMessages', 'please login to continue')
      res.redirect('/login')
      return
    }
    next()
  }
}
