//@ts-check
const extractUser = require('../utils/extractUser')
const isLoggedIn = require('../utils/isLoggedIn')

function normalizeOpts(opts) {
  if (!opts) {
    opts = {}
  }
  if (!opts.allowedRoles) {
    opts.allowedRoles = ['user', 'admin']
  }
  return opts
}

function isRoleAllowed(role, allowedRoles) {
  let found = false
  for (let allowedRole of allowedRoles) {
    if (role == allowedRole) {
      found = true
      break
    }
  }
  return found
}

module.exports = function (opts) {
  return function (req, res, next) {
    opts = normalizeOpts(opts)
    //check if logged in
    if (!isLoggedIn(req)) {
      req.flash('errorMessages', 'please login to continue')
      res.redirect('/login')
      return
    }
    const user = extractUser(req)
    //check authorization
    if (!isRoleAllowed(user.role, opts.allowedRoles)) {
      req.flash('errorMessages', 'not authorized')
      res.redirect('/')
      return
    }
    next()
  }
}
