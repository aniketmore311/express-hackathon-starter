//@ts-check
module.exports = function (req) {
  const user = req.session.user
  if (user) {
    return true
  } else {
    return false
  }
}
