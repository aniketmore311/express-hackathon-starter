//@ts-check

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
 * @typedef {object} AuthorizeOpts
 * @property {string[]} [allowedRoles]
 */

/**
 * @param {AuthorizeOpts} [opts]
 * @returns {import("express").RequestHandler}
 */
function authorize(opts) {
  return function (req, res, next) {
    opts = normalizeOpts(opts)
    //@ts-ignore
    const user = req.user
    // not logged in
    if (!user) {
      req.flash('errorMessages', 'please login to continue')
      res.redirect('/login')
      return
    } else {
      //check authorization
      if (!isRoleAllowed(user.role, opts.allowedRoles)) {
        req.flash('errorMessages', 'not authorized')
        res.redirect('/')
        return
      }
      next()
    }
  }
}

module.exports = authorize
