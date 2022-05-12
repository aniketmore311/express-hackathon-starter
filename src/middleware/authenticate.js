const User = require('../models/User')

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

/**
 * @returns {import('express').RequestHandler}
 */
module.exports = function (opts) {
  return function (req, res, next) {
    opts = normalizeOpts(opts)
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
        if (!isRoleAllowed(user.role, opts.allowedRoles)) {
          req.flash('errorMessages', 'not authorized')
          res.redirect('/')
          return
        }
        req.session.user = user
        next()
      })
      .catch(next)
  }
}
