/**
 * @param {*} opts
 * @returns {import("express").RequestHandler}
 */
function populateLocals(opts) {
  return function (req, res, next) {
    res.locals.user = req.user
    res.locals.isLoggedIn = req.user ? true : false
    res.locals.successMessages = req.flash('successMessages')
    res.locals.errorMessages = req.flash('errorMessages')
    next()
  }
}

module.exports = populateLocals
