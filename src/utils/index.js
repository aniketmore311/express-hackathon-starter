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

function createOTP() {
  //write a function to create 6 digit otp
  const otp = Math.floor(Math.random() * 1000000)
  const otpStr = otp.toString()
  return otpStr
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

function getUser(req) {
  const user = req.user
  return user
}

function isLoggedIn(req) {
  const user = req.user
  if (user) {
    return true
  } else {
    return false
  }
}

module.exports = {
  catchAsync,
  createVerificationCode,
  extractErrorMessage,
  getUser,
  isLoggedIn,
  createOTP,
}
