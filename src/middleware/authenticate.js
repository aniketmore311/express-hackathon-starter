const mongoose = require('mongoose')
const User = mongoose.models.User

/**
 *
 * @param {*} opts
 * @returns {import("express").RequestHandler}
 */
//eslint-disable-next-line no-unused-vars
function authenticate(opts) {
  return function (req, res, next) {
    const id = req.session.userId
    // if not logged in
    if (!id) {
      req.user = null
      next()
    } else {
      User.findById(id, (error, user) => {
        if (error) {
          next(error)
        } else if (user == undefined || user == null) {
          req.user = null
          next()
        } else {
          req.user = user
          next()
        }
      })
    }
  }
}

module.exports = authenticate
