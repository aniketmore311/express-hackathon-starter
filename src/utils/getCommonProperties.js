//@ts-check
module.exports = function (req) {
  const user = req.session.user
  const successMessage = req.flash('successMessages')[0]
  const errorMessage = req.flash('errorMessages')[0]
  return {
    user,
    successMessage,
    errorMessage,
  }
}
