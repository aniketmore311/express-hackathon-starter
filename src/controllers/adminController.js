const express = require('express')
const authorize = require('../middleware/authorize')
/**
 *
 * @param {import('express').Application} app
 */
module.exports = function (app) {
  const router = express.Router()

  router.get('/home', (req, res) => {
    res.render('admin/home')
  })

  app.use(
    '/admin',
    authorize({
      allowedRoles: ['admin'],
    }),
    router
  )
}
