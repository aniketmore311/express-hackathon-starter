//@ts-check
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {void}
 */
module.exports = function (req, res) {
  //@ts-ignore
  res.locals.user = req.session.user
  res.locals.successMessages = req.flash('successMessages')
  res.locals.errorMessages = req.flash('errorMessages')
}
