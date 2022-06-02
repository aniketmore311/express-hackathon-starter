module.exports = function (asyncHandler) {
  return function (req, res, next) {
    asyncHandler(req, res, next).catch(next)
  }
}
