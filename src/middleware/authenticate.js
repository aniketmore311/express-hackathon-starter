const User = require('../models/User')

/**
 * @returns {import('express').RequestHandler}
 */
module.exports = function () {
  return function (req, res, next) {
    const userId = req.session.userId
    //check if logged in
    if (!userId) {
      req.flash('errorMessages', 'please login to continue')
      res.redirect('/login')
      return
    }
    //populate user
    User.findById(userId)
      .then((user) => {
        req.session.user = user
        next()
      })
      .catch(next)
  }
}
