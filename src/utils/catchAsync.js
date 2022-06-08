//@ts-check
/**
 * @typedef {(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction)=> Promise<any>} AsyncHandler
 */
/**
 * @param {AsyncHandler} asyncHandler
 * @returns {import("express").RequestHandler}
 */
module.exports = function (asyncHandler) {
  return function (req, res, next) {
    asyncHandler(req, res, next).catch(next)
  }
}
