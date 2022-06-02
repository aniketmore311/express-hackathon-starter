//@ts-check
module.exports = function (req, res) {
  res.locals.user = req.session.user
  res.locals.successMessages = req.flash('successMessages')
  res.locals.errorMessages = req.flash('errorMessages')
}
