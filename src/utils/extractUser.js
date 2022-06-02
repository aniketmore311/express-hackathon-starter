module.exports = function (req) {
  const user = req.session.user
  return user
}
