//@ts-check
const crypto = require('crypto')
const { validationResult } = require('express-validator')

/**
 * @typedef {(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction)=> Promise<any>} AsyncHandler
 */

/**
 * @param {AsyncHandler} asyncHandler
 * @returns {import("express").RequestHandler}
 */
function catchAsync(asyncHandler) {
  return function (req, res, next) {
    asyncHandler(req, res, next).catch(next)
  }
}

function createVerificationCode() {
  const code = crypto.randomBytes(8).toString('hex')
  return code
}

function extractErrorMessage(req) {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return null
  } else {
    const error = errors.array()[0]
    const message = error.param + ' ' + error.msg
    return message
  }
}

function extractUser(req) {
  const user = req.session.user
  return user
}

function isLoggedIn(req) {
  const user = req.session.user
  if (user) {
    return true
  } else {
    return false
  }
}

function populateLocals(req, res) {
  res.locals.user = req.session.user
  res.locals.successMessages = req.flash('successMessages')
  res.locals.errorMessages = req.flash('errorMessages')
}

module.exports = {
  catchAsync,
  createVerificationCode,
  extractErrorMessage,
  extractUser,
  isLoggedIn,
  populateLocals,
}
