const { validationResult } = require('express-validator')

function normalizeOpts(opts) {
  if (!opts) {
    opts = {}
  }
  if (!opts.getRedirectUrl) {
    opts.getRedirectUrl = () => '/'
  }
  return opts
}

/**
 * @param {{getRedirectUrl: (req: import('express').Request, res: import('express').Response) => String}} opts
 * @returns {import("express").RequestHandler}
 */
function validate(opts) {
  opts = normalizeOpts(opts)
  return function (req, res, next) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      next()
    } else {
      const error = errors.array()[0]
      const message = error.param + ' ' + error.msg
      req.flash('errorMessages', message)
      console.log('redirect url')
      console.log(opts.getRedirectUrl(req, res))
      res.redirect(opts.getRedirectUrl(req, res))
    }
  }
}

module.exports = validate
